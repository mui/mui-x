import { createTooltipGetter } from '../../internals/createTooltipGetter';
import type { AxisTooltipGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter = createTooltipGetter<'line'>({ includeMarkShape: true });

export const axisTooltipGetter: AxisTooltipGetter<'line', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
