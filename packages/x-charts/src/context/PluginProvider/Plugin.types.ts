import type { ChartSeriesType } from '../../models/seriesType/config';
import type { ColorProcessor, ColorProcessorsConfig } from './ColorProcessor.types';
import type { ExtremumGetter, ExtremumGettersConfig } from './ExtremumGetter.types';
import type { SeriesFormatter, SeriesFormatterConfig } from './SeriesFormatter.types';

export type PluginProviderProps = {
  /**
   * An array of plugins defining how to preprocess data.
   * If not provided, the container supports line, bar, scatter and pie charts.
   */
  plugins?: ChartsPlugin<ChartSeriesType>[];
  children: React.ReactNode;
};

export type PluginContextState = {
  seriesFormatters: SeriesFormatterConfig<ChartSeriesType>;
  colorProcessors: ColorProcessorsConfig<ChartSeriesType>;
  xExtremumGetters: ExtremumGettersConfig<ChartSeriesType>;
  yExtremumGetters: ExtremumGettersConfig<ChartSeriesType>;
};

export type ChartsPlugin<T> = T extends ChartSeriesType
  ? {
      seriesType: T;
      seriesFormatter: SeriesFormatter<T>;
      colorProcessor: ColorProcessor<T>;
      xExtremumGetter?: ExtremumGetter<T>;
      yExtremumGetter?: ExtremumGetter<T>;
    }
  : never;
