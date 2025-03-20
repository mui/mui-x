import type { SeriesProcessor } from './seriesProcessor.types';
import type {
  CartesianChartSeriesType,
  ChartSeriesType,
  PolarChartSeriesType,
} from '../../../../models/seriesType/config';
import type { ColorProcessor } from './colorProcessor.types';
import type { CartesianExtremumGetter } from './cartesianExtremumGetter.types';
import type { LegendGetter } from './legendGetter.types';
import type { AxisTriggeringTooltipGetter, TooltipGetter } from './tooltipGetter.types';
import { PolarExtremumGetter } from './polarExtremumGetter.types';
import { GetSeriesWithDefaultValues } from './getSeriesWithDefaultValues.types';

export type ChartSeriesTypeConfig<TSeriesType extends ChartSeriesType> = {
  seriesProcessor: SeriesProcessor<TSeriesType>;
  colorProcessor: ColorProcessor<TSeriesType>;
  legendGetter: LegendGetter<TSeriesType>;
  tooltipGetter: TooltipGetter<TSeriesType>;
  getSeriesWithDefaultValues: GetSeriesWithDefaultValues<TSeriesType>;
} & (TSeriesType extends CartesianChartSeriesType
  ? {
      xExtremumGetter: CartesianExtremumGetter<TSeriesType>;
      yExtremumGetter: CartesianExtremumGetter<TSeriesType>;
      axisTriggeringTooltipGetter?: AxisTriggeringTooltipGetter<TSeriesType, 'x' | 'y'>;
    }
  : {}) &
  (TSeriesType extends PolarChartSeriesType
    ? {
        rotationExtremumGetter: PolarExtremumGetter<TSeriesType>;
        radiusExtremumGetter: PolarExtremumGetter<TSeriesType>;
        axisTriggeringTooltipGetter?: AxisTriggeringTooltipGetter<
          TSeriesType,
          'rotation' | 'radius'
        >;
      }
    : {});

export type ChartSeriesConfig<TSeriesType extends ChartSeriesType> = {
  [Key in TSeriesType]: ChartSeriesTypeConfig<Key>;
};
