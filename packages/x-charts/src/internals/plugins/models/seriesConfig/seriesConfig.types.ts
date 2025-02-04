import type { SeriesProcessor } from './seriesProcessor.types';
import type {
  CartesianChartSeriesType,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import type { ColorProcessor } from './colorProcessor.types';
import type { CartesianExtremumGetter } from './extremumGetter.types';
import type { LegendGetter } from './legendGetter.types';
import type { TooltipGetter } from './tooltipGetter.types';

export type ChartSeriesTypeConfig<TSeriesType extends ChartSeriesType> = {
  seriesProcessor: SeriesProcessor<TSeriesType>;
  colorProcessor: ColorProcessor<TSeriesType>;
  legendGetter: LegendGetter<TSeriesType>;
  tooltipGetter: TooltipGetter<TSeriesType>;
  // rotationExtremumGetters: ExtremumGettersConfig<Key>;
  // radiusExtremumGetters: ExtremumGettersConfig<Key>;
} & (TSeriesType extends CartesianChartSeriesType
  ? {
      xExtremumGetter: CartesianExtremumGetter<TSeriesType>;
      yExtremumGetter: CartesianExtremumGetter<TSeriesType>;
    }
  : {});

export type ChartSeriesConfig<TSeriesType extends ChartSeriesType> = {
  [Key in TSeriesType]: ChartSeriesTypeConfig<Key>;
};
