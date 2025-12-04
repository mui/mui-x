'use client';
import * as React from 'react';
import { type ChartPlugin } from '../../models';
import { type UseChartIdSignature } from './useChartId.types';
import { createChartDefaultId } from './useChartId.utils';

export const useChartId: ChartPlugin<UseChartIdSignature> = ({ params, store }) => {
  React.useEffect(() => {
    if (
      params.id === undefined ||
      (params.id === store.state.id.providedChartId && store.state.id.chartId !== undefined)
    ) {
      return;
    }
    store.set('id', { ...store.state.id, chartId: params.id ?? createChartDefaultId() });
  }, [store, params.id]);
  return {};
};

useChartId.params = {
  id: true,
};

useChartId.getInitialState = ({ id }) => ({
  id: { chartId: id, providedChartId: id },
});
