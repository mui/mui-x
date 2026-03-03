import type { CartesianChartSeriesType } from '../../../../../models';
import { type ItemTooltip, type SeriesItem } from '../../../../../ChartsTooltip';
import type {
  ChartSeriesType,
  PolarChartSeriesType,
} from '../../../../../models/seriesType/config';

export interface AxisTooltipContentProps<
  T extends CartesianChartSeriesType | PolarChartSeriesType,
> {
  item: SeriesItem<T>;
}

export interface ItemTooltipContentProps<T extends ChartSeriesType> {
  item: ItemTooltip<T>;
}
