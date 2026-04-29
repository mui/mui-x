import { createLineStyleTooltipGetter } from '../../internals/createLineStyleTooltipGetter';
import type { AxisTooltipGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter = createLineStyleTooltipGetter<'line'>();

export const axisTooltipGetter: AxisTooltipGetter<'line', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
