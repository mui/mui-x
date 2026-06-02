import { type ChartSeriesSamplers } from '@mui/x-charts/internals';
import { lineSampler } from './samplers/lineSampler';
import { scatterSampler } from './samplers/scatterSampler';
import { barSampler } from './samplers/barSampler';

/**
 * The built-in samplers registered by the Pro sampling plugin, keyed by series type.
 */
export const samplerRegistry: ChartSeriesSamplers = {
  line: lineSampler,
  scatter: scatterSampler,
  bar: barSampler,
};
