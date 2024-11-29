import { SeriesProcessor } from './seriesProcessor.types';
import { CartesianChartSeriesType, ChartSeriesType } from '../../../../models/seriesType/config';
import { ColorProcessor } from './colorProcessor.types';
import { CartesianExtremumGetter } from './extremumGetter.types';

export type ChartSeriesTypeConfig<TSeriesType extends ChartSeriesType> = {
  seriesProcessor: SeriesProcessor<TSeriesType>;
  colorProcessor: ColorProcessor<TSeriesType>;
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
