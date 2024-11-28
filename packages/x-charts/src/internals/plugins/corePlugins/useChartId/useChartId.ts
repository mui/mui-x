// import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartPlugin } from '../../models';
import { UseChartIdSignature } from './useChartId.types';
// import { createChartDefaultId } from './useChartId.utils';

export const useChartId: ChartPlugin<UseChartIdSignature> = ({ params, store }) => {
  const id = useId();

  // React.useEffect(() => {
  store.update((prevState) => {
    if (params.id === prevState.id.providedChartId && prevState.id.chartId !== undefined) {
      return prevState;
    }

    return {
      ...prevState,
      id: { ...prevState.id, chartId: params.id ?? `mui-chart-${id}u` },
    };
  });
  // }, [store, params.id]);
  return {};
};

useChartId.params = {
  id: true,
};

useChartId.getInitialState = ({ id }) => ({
  id: { chartId: undefined, providedChartId: id },
});
