'use client';
import * as React from 'react';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { type ChartPlugin } from '../../models';
import type {
  ChartSeriesProcessorOutput,
  UseChartSeriesState,
  UseChartSeriesSignature,
} from './useChartSeries.types';
import { ChartsSeriesProcessorContext } from './ChartsSeriesProcessorContext';
import { rainbowSurgePalette } from '../../../../colorPalettes';
import { defaultizeSeries } from './processSeries';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import type {
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
  SeriesId,
} from '../../../../models/seriesType';
import { type AsyncPipelineResult, runAsyncPipeline } from '../../utils/asyncResource';

type RetrunedType<SeriesType extends ChartSeriesType, Item> =
  Item extends SeriesItemIdentifier<SeriesType>
    ? SeriesItemIdentifierWithType<SeriesType>
    : Item & { type: SeriesType };

export function createIdentifierWithType(state: UseChartSeriesState) {
  function identifierWithType<
    SeriesType extends ChartSeriesType,
    Item extends { seriesId: SeriesId; type?: SeriesType },
  >(identifier: Item): RetrunedType<SeriesType, Item> {
    if (identifier.type !== undefined) {
      return identifier as RetrunedType<SeriesType, Item>;
    }
    const type = state.series.idToType.get(identifier.seriesId);

    if (type === undefined) {
      throw new Error(
        `MUI X Charts: The id "${identifier.seriesId}" is not associated with any series. ` +
          'This may indicate the series was not properly registered or the id is incorrect. ' +
          'Verify the series id matches one defined in your chart configuration.',
      );
    }
    return { ...identifier, type } as RetrunedType<SeriesType, Item>;
  }

  return identifierWithType;
}

export const useChartSeries: ChartPlugin<UseChartSeriesSignature> = ({ params, store }) => {
  const { series, dataset, theme, colors } = params;
  // Auto-detect an off-thread processor (e.g. the worker-backed one provided
  // by `@mui/x-charts-premium`). When the context is unset, the plugin runs
  // `defaultizeSeries` locally on the next task tick.
  const seriesProcessor = React.useContext(ChartsSeriesProcessorContext);

  // The series defaultize step runs on the next task tick so the commit is
  // decoupled from the render. The first render is handled by `getInitialState`
  // (sync defaultize, status starts at `pending`); this effect only fires on
  // subsequent prop updates. Stale resolves are dropped via `requestRef`.
  //
  // When a `seriesProcessor` is supplied (e.g. the worker-backed processor
  // from `@mui/x-charts-premium`), it receives the resolved colors / theme /
  // series and returns the defaultized output via a Promise. Otherwise the
  // step runs locally on the next task tick via `runAsyncPipeline`.
  const requestRef = React.useRef(0);
  useEffectAfterFirstRender(() => {
    requestRef.current += 1;
    const reqId = requestRef.current;

    const resolvedColors = typeof colors === 'function' ? colors(theme) : colors;

    const commit = (result: AsyncPipelineResult<ChartSeriesProcessorOutput>) => {
      if (result.status === 'pending') {
        store.set('series', {
          ...store.state.series,
          status: 'pending',
          error: undefined,
        });
        return;
      }
      if (result.status === 'error') {
        store.set('series', {
          ...store.state.series,
          status: 'error',
          error: result.error,
        });
        return;
      }
      const { defaultizedSeries, idToType } = result.data!;
      store.set('series', {
        ...store.state.series,
        defaultizedSeries,
        idToType,
        dataset,
        status: 'success',
        error: undefined,
      });
    };

    if (seriesProcessor) {
      // Off-thread path. The processor returns a Promise — surface
      // `pending` immediately, then route success/error through `commit`.
      // Stale resolves (request id mismatch) are dropped here.
      commit({ status: 'pending' });
      seriesProcessor({ series, colors: resolvedColors, theme }).then(
        (data) => {
          if (reqId !== requestRef.current) {
            return;
          }
          commit({ status: 'success', data });
        },
        (err) => {
          if (reqId !== requestRef.current) {
            return;
          }
          commit({ status: 'error', error: err as Error });
        },
      );
      return;
    }

    runAsyncPipeline(
      () =>
        defaultizeSeries({
          series,
          colors: resolvedColors,
          theme,
          seriesConfig: store.state.seriesConfig.config,
        }),
      commit,
      requestRef,
      reqId,
    );
  }, [series, dataset, colors, theme, store, seriesProcessor]);

  // Re-throw an error captured by the async pipeline. Read directly from
  // `store.state` rather than via `store.use` to avoid an extra subscription
  // that would perturb effect ordering during the first render.
  const seriesError = store.state.series?.error;
  if (store.state.series?.status === 'error' && seriesError) {
    throw seriesError;
  }

  const identifierWithType = createIdentifierWithType(store.state);

  return { instance: { identifierWithType } };
};

useChartSeries.params = {
  dataset: true,
  series: true,
  colors: true,
  theme: true,
};

const EMPTY_ARRAY: any[] = [];

useChartSeries.getDefaultizedParams = ({ params }) => ({
  ...params,
  series: params.series?.length ? params.series : EMPTY_ARRAY,
  colors: params.colors ?? rainbowSurgePalette,
  theme: params.theme ?? 'light',
});

useChartSeries.getInitialState = ({ series = [], colors, theme, dataset }, currentState) => {
  // Defaultize synchronously so the first paint already has data — every
  // downstream selector/hook (useXScale, useSeries, etc.) expects series and
  // axes to be present. The runtime effect (skipping the first render) takes
  // over from here and flips status to `pending` then `success` on prop
  // updates.
  const seriesConfig = currentState.seriesConfig.config;
  const { defaultizedSeries, idToType } = defaultizeSeries({
    series,
    colors: typeof colors === 'function' ? colors(theme) : colors,
    theme,
    seriesConfig,
  });
  return {
    series: {
      defaultizedSeries,
      idToType,
      dataset,
      status: 'success' as const,
    },
  };
};
