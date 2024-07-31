import type { ChartSeriesType } from '../../models/seriesType/config';
import type { ColorProcessor } from './ColorProcessor.types';
import type { ExtremumGetter } from './ExtremumGetter.types';
import { SeriesFormatter } from './SeriesFormatter.types';

export type PluginProviderProps = {
  plugins?: ChartsPluginType<ChartSeriesType>[];
  children: React.ReactNode;
};

// TODO: wrong
export type PluginContextState = ChartsPluginType<ChartSeriesType>;

export type ChartsPluginType<T> = T extends ChartSeriesType
  ? {
      seriesType: T;
      seriesFormatter: SeriesFormatter<T>;
      colorProcessor: ColorProcessor<T>;
      xExtremumGetter?: ExtremumGetter<T>;
      yExtremumGetter?: ExtremumGetter<T>;
    }
  : never;
