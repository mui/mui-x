import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getDataItemLegendItems } from '../../internals/legendUtils';

const legendGetter: LegendGetter<'pie'> = (series) => getDataItemLegendItems('pie', series);

export default legendGetter;
