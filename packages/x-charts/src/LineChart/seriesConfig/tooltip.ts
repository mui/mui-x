import { getLineLikeTooltip } from '../../internals/getLineLikeTooltip';
import {
  type AxisTooltipGetter,
  type TooltipGetter,
} from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter: TooltipGetter<'line'> = (params) =>
  getLineLikeTooltip(params, { includeMarkShape: true });

export const axisTooltipGetter: AxisTooltipGetter<'line', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
