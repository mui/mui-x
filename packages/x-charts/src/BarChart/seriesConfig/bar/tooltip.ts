import { getLineLikeTooltip } from '../../../internals/getLineLikeTooltip';
import type {
  AxisTooltipGetter,
  TooltipGetter,
} from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter: TooltipGetter<'bar'> = (params) =>
  getLineLikeTooltip(params, { skipNullValues: true });

export const axisTooltipGetter: AxisTooltipGetter<'bar', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) =>
    s.layout === 'horizontal'
      ? { direction: 'y', axisId: s.yAxisId }
      : { direction: 'x', axisId: s.xAxisId },
  );
};

export default tooltipGetter;
