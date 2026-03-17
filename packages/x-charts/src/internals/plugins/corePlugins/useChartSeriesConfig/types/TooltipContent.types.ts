import type { CartesianChartSeriesType } from '../../../../../models';
import {
  type ChartsTooltipClasses,
  type ItemTooltip,
  type SeriesItem,
} from '../../../../../ChartsTooltip';
import type {
  ChartSeriesType,
  PolarChartSeriesType,
} from '../../../../../models/seriesType/config';
import { type ItemTooltipWithMultipleValues } from './tooltipGetter.types';

export interface AxisTooltipContentProps<
  T extends CartesianChartSeriesType | PolarChartSeriesType,
> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: Partial<ChartsTooltipClasses> | undefined;
  item: SeriesItem<T>;
}

export interface ItemTooltipContentProps<T extends ChartSeriesType> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: Partial<ChartsTooltipClasses> | undefined;
  item: ItemTooltip<T> | ItemTooltipWithMultipleValues;
}
