import { createTooltipGetter } from '../../../internals/createTooltipGetter';
import type { AxisTooltipGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter = createTooltipGetter<'bar'>({ skipNullValues: true });

export const axisTooltipGetter: AxisTooltipGetter<'bar', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) =>
    s.layout === 'horizontal'
      ? { direction: 'y', axisId: s.yAxisId }
      : { direction: 'x', axisId: s.xAxisId },
  );
};

export default tooltipGetter;
