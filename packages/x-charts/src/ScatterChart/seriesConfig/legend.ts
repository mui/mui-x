import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesLegendItems } from '../../internals/legendUtils';

const legendGetter: LegendGetter<'scatter'> = (series) => getSeriesLegendItems('scatter', series);

export default legendGetter;
