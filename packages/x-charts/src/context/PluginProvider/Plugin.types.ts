import type { ChartSeriesType } from '../../models/seriesType/config';
import type { ColorProcessor, ColorProcessorsConfig } from './ColorProcessor.types';
import type { ExtremumGetter, ExtremumGettersConfig } from './ExtremumGetter.types';
import type { SeriesFormatter, SeriesFormatterConfig } from './SeriesFormatter.types';

export type PluginProviderProps = {
  plugins?: ChartsPluginType<ChartSeriesType>[];
  children: React.ReactNode;
};

export type PluginContextState = {
  seriesFormatters: SeriesFormatterConfig<ChartSeriesType>;
  colorProcessors: ColorProcessorsConfig<ChartSeriesType>;
  xExtremumGetters: ExtremumGettersConfig<ChartSeriesType>;
  yExtremumGetters: ExtremumGettersConfig<ChartSeriesType>;
};

export type ChartsPluginType<T> = T extends ChartSeriesType
  ? {
      seriesType: T;
      seriesFormatter: SeriesFormatter<T>;
      colorProcessor: ColorProcessor<T>;
      xExtremumGetter?: ExtremumGetter<T>;
      yExtremumGetter?: ExtremumGetter<T>;
    }
  : never;
