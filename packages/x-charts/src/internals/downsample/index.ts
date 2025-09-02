// Export types
export type {
  DownsampleStrategy,
  DownsampleConfig,
  DownsampleFunction,
  DownsampleProp,
} from './types';

// Export downsampling functions
export { linearDownsample } from './sampling/linear';
export { peakDownsample } from './sampling/peak';
export { maxDownsample } from './sampling/max';
export { minDownsample } from './sampling/min';
export { averageDownsample } from './sampling/average';

// Export application functions
export { useDownsampling } from './useDownsampling';
