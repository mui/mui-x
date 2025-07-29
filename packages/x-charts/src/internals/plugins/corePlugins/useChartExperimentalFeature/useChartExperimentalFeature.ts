'use client';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin } from '../../models';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const useChartExperimentalFeatures: ChartPlugin<UseChartExperimentalFeaturesSignature> = ({
  params,
  store,
}) => {
  useEnhancedEffect(() => {
    store.update((prevState) => {
      return {
        ...prevState,
        experimentalFeatures: params.experimentalFeatures,
      };
    });
  }, [store, params.experimentalFeatures]);

  return {};
};

useChartExperimentalFeatures.params = {
  experimentalFeatures: true,
};

useChartExperimentalFeatures.getInitialState = ({ experimentalFeatures }) => {
  return {
    experimentalFeatures,
  };
};
