'use client';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { type ChartPlugin } from '../../models';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const useChartExperimentalFeatures: ChartPlugin<UseChartExperimentalFeaturesSignature> = ({
  params,
  store,
}) => {
  useEnhancedEffect(() => {
    store.set('experimentalFeatures', params.experimentalFeatures);
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
