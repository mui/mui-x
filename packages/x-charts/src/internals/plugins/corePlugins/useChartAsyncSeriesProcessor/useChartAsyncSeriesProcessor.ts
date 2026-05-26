'use client';
import * as React from 'react';
import { type ChartPlugin } from '../../models';
import { type UseChartAsyncSeriesProcessorSignature } from './useChartAsyncSeriesProcessor.types';
import {
  selectorChartDefaultizedSeries,
  selectorChartsDataset,
} from '../useChartSeries/useChartSeries.selectors';
import { selectorIsItemVisibleGetter } from '../../featurePlugins/useChartVisibilityManager';
import { buildHiddenIdsMap, reattachFunctions, stripFunctionsFromSeries } from './serialize';
import { type ProcessedSeries } from '../useChartSeries/useChartSeries.types';

let nextRequestId = 0;

export const useChartAsyncSeriesProcessor: ChartPlugin<UseChartAsyncSeriesProcessorSignature> = ({
  params,
  store,
}) => {
  const enabled = params.asyncProcessing ?? false;
  const defaultizedSeries = store.use(selectorChartDefaultizedSeries);
  const dataset = store.use(selectorChartsDataset);
  const isItemVisible = store.use(selectorIsItemVisibleGetter);

  React.useEffect(() => {
    if (!enabled) {
      // Make sure consumers see the sync path again when async is turned off.
      if (store.state.asyncSeriesProcessor.enabled) {
        store.set('asyncSeriesProcessor', {
          enabled: false,
          isProcessing: false,
          processedSeries: null,
          requestId: store.state.asyncSeriesProcessor.requestId,
        });
      }
      return undefined;
    }

    if (typeof Worker === 'undefined') {
      // SSR / no-Worker environment. Fall back to the sync path silently.
      return undefined;
    }

    nextRequestId += 1;
    const requestId = nextRequestId;
    store.set('asyncSeriesProcessor', {
      enabled: true,
      isProcessing: true,
      processedSeries: store.state.asyncSeriesProcessor.processedSeries,
      requestId,
    });

    const worker = new Worker(new URL('./seriesProcessorWorker', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<{ processed: ProcessedSeries }>) => {
      // Drop stale responses (a newer request superseded this one).
      if (store.state.asyncSeriesProcessor.requestId !== requestId) {
        worker.terminate();
        return;
      }
      const merged = reattachFunctions(event.data.processed, defaultizedSeries);
      store.set('asyncSeriesProcessor', {
        enabled: true,
        isProcessing: false,
        processedSeries: merged,
        requestId,
      });
      worker.terminate();
    };

    const stripped = stripFunctionsFromSeries(defaultizedSeries);
    const hiddenIds = buildHiddenIdsMap(defaultizedSeries, isItemVisible);
    worker.postMessage({ defaultizedSeries: stripped, dataset, hiddenIds });

    return () => {
      worker.terminate();
    };
  }, [enabled, defaultizedSeries, dataset, isItemVisible, store]);

  return {};
};

useChartAsyncSeriesProcessor.params = {
  asyncProcessing: true,
};

useChartAsyncSeriesProcessor.getDefaultizedParams = ({ params }) => ({
  ...params,
  asyncProcessing: params.asyncProcessing ?? false,
});

useChartAsyncSeriesProcessor.getInitialState = ({ asyncProcessing }) => ({
  asyncSeriesProcessor: {
    enabled: asyncProcessing ?? false,
    isProcessing: false,
    processedSeries: null,
    requestId: 0,
  },
});
