import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesLegendItems } from '../../internals/legendUtils';

const legendGetter: LegendGetter<'line'> = (series) =>
  getSeriesLegendItems('line', series, undefined, (s) =>
    s.showMark ? (s.shape ?? 'circle') : undefined,
  );

export default legendGetter;
