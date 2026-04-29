import type { LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesLegendItems } from '../../internals/legendUtils';

const legendGetter: LegendGetter<'line'> = (series) => getSeriesLegendItems('line', series);

export default legendGetter;
