import { FormattedSeries } from '../context/SeriesProvider';
import { ChartSeriesType } from '../models/seriesType/config';
import { LegendGetter } from '../context/PluginProvider';

import getBarLegend from '../BarChart/legend';
import getScatterLegend from '../ScatterChart/legend';
import getLineLegend from '../LineChart/legend';
import getPieLegend from '../PieChart/legend';

const legendGetter: { [T in ChartSeriesType]?: LegendGetter<T> } = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend,
};

export function getSeriesToDisplay(series: FormattedSeries) {
  return (Object.keys(series) as ChartSeriesType[]).flatMap(
    <T extends ChartSeriesType>(seriesType: T) => {
      const getter = legendGetter[seriesType as T];
      return getter === undefined ? [] : getter(series[seriesType as T]!);
    },
  );
}
