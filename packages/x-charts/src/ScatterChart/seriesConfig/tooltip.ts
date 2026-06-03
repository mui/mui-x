import { getLineLikeTooltip } from '../../internals/getLineLikeTooltip';
import { type TooltipGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter: TooltipGetter<'scatter'> = (params) => getLineLikeTooltip(params);

export default tooltipGetter;
