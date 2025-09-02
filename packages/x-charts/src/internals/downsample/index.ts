// Export types
export type {
  DownsampleStrategy,
  DownsampleConfig,
  DownsampleFunction,
  DownsampleProp,
} from './types';

export { DEFAULT_TARGET_POINTS } from './types';

// Export downsampling functions
export { linearDownsample, getLinearDownsampleIndices } from './linearDownsample';
export { peakDownsample, getPeakDownsampleIndices } from './peakDownsample';
export { maxDownsample, getMaxDownsampleIndices } from './maxDownsample';
export { minDownsample, getMinDownsampleIndices } from './minDownsample';
export { averageDownsample } from './averageDownsample';

// Export utility functions
export { getDownsampleIndices } from './utils';

// Export application functions
export { applyDownsample } from './applyDownsample';
export { applyChartDownsampling } from './applyChartDownsampling';
export { applyDownsampleWithAxis } from './applyDownsampleWithAxis';
