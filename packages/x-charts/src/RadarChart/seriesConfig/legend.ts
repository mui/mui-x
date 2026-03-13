import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesLegendItems } from '../../internals/legendUtils';

const legendGetter: LegendGetter<'radar'> = (series) =>
  getSeriesLegendItems('radar', series, 'square');

export default legendGetter;
