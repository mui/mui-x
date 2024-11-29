import { ChartSeriesType } from '../models/seriesType/config';
import getBarLegend from '../BarChart/legend';
import getScatterLegend from '../ScatterChart/legend';
import getLineLegend from '../LineChart/legend';
import getPieLegend from '../PieChart/legend';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { LegendGetter } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';

const legendGetter: { [T in ChartSeriesType]?: LegendGetter<T> } = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend,
};

export function getSeriesToDisplay(series: ProcessedSeries) {
  return (Object.keys(series) as ChartSeriesType[]).flatMap(
    <T extends ChartSeriesType>(seriesType: T) => {
      const getter = legendGetter[seriesType as T];
      return getter === undefined ? [] : getter(series[seriesType as T]!);
    },
  );
}
