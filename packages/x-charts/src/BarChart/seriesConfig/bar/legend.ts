import type { LegendGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesLegendItems } from '../../../internals/legendUtils';

const legendGetter: LegendGetter<'bar'> = (series) => getSeriesLegendItems('bar', series);

export default legendGetter;
