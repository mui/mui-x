import { FormattedSeries } from '../context/SeriesContextProvider';
import { ChartSeriesType, LegendGetter } from '../models/seriesType/config';
import getBarLegend from '../BarChart/legend';
import getScatterLegend from '../ScatterChart/legend';
import getLineLegend from '../LineChart/legend';
import getPieLegend from '../PieChart/legend';

export type AnchorX = 'left' | 'right' | 'middle';
export type AnchorY = 'top' | 'bottom' | 'middle';

export type AnchorPosition = { horizontal: AnchorX; vertical: AnchorY };

export type SizingParams = {
  direction?: 'row' | 'column';
  markSize?: number;
  itemWidth?: number;
  spacing?: number;
};

const legendGetter: { [T in ChartSeriesType]: LegendGetter<T> } = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend,
};

export function getSeriesToDisplay(series: FormattedSeries) {
  return (Object.keys(series) as ChartSeriesType[]).flatMap(
    <T extends ChartSeriesType>(seriesType: T) =>
      legendGetter[seriesType as T](series[seriesType as T]!),
  );
}
