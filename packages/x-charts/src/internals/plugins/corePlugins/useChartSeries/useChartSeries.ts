'use client';
import * as React from 'react';
import { type ChartPlugin } from '../../models';
import type { UseChartSeriesState, UseChartSeriesSignature } from './useChartSeries.types';
import { rainbowSurgePalette } from '../../../../colorPalettes';
import { defaultizeSeries } from './processSeries';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import type {
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
  SeriesId,
} from '../../../../models/seriesType';
import { runAsyncPipeline } from '../../utils/asyncResource';

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

  // The series defaultize step runs on the next task tick so the commit is
  // decoupled from the render — the browser can paint the `pending` state
  // first. This also fires on initial mount (the store starts in `pending`
  // from `getInitialState`). Stale resolves are dropped via `requestRef`.
  const requestRef = React.useRef(0);
  React.useEffect(() => {
    requestRef.current += 1;
    const reqId = requestRef.current;

    runAsyncPipeline(
      () =>
        defaultizeSeries({
          series,
          colors: typeof colors === 'function' ? colors(theme) : colors,
          theme,
          seriesConfig: store.state.seriesConfig.config,
        }),
      (result) => {
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
      },
      requestRef,
      reqId,
    );
  }, [series, dataset, colors, theme, store]);

  const seriesState = store.use((state) => state.series);
  if (seriesState.status === 'error' && seriesState.error) {
    throw seriesState.error;
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

useChartSeries.getInitialState = ({ dataset }) => {
  // Initial state is empty + `pending`; the runtime effect runs the defaultize
  // step on the next macrotask and commits the real data. This keeps the
  // first-mount path consistent with subsequent prop updates.
  return {
    series: {
      defaultizedSeries: {},
      idToType: new Map(),
      dataset,
      status: 'pending' as const,
    },
  };
};
