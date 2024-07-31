import * as React from 'react';
import { ChartsPluginType } from './Plugin.types';
import { ChartSeriesType } from '../../models/seriesType/config';
import { defaultPlugins } from '../../ChartContainer/defaultPlugins';
import { SeriesFormatter, SeriesFormatterConfig } from './SeriesFormatter.types';
import { ColorProcessor, ColorProcessorsConfig } from './ColorProcessor.types';
import { ExtremumGetter, ExtremumGettersConfig } from './ExtremumGetter.types';

export function usePluginsMerge<T extends ChartSeriesType>(plugins?: ChartsPluginType<T>[]) {
  const defaultizedPlugins = plugins ?? defaultPlugins;

  return React.useMemo(() => {
    const seriesFormatters: SeriesFormatterConfig<ChartSeriesType> = {};
    const colorProcessors: ColorProcessorsConfig<ChartSeriesType> = {};
    const xExtremumGetters: ExtremumGettersConfig<ChartSeriesType> = {};
    const yExtremumGetters: ExtremumGettersConfig<ChartSeriesType> = {};

    for (let i = 0; i < defaultizedPlugins.length; i += 1) {
      const plugin = defaultizedPlugins[i];
      const seriesType = plugin.seriesType;

      seriesFormatters[seriesType] = plugin.seriesFormatter as SeriesFormatter<typeof seriesType>;

      colorProcessors[seriesType] = plugin.colorProcessor as ColorProcessor<typeof seriesType>;

      if (plugin.xExtremumGetter) {
        xExtremumGetters[seriesType] = plugin.xExtremumGetter as ExtremumGetter<typeof seriesType>;
      }

      if (plugin.yExtremumGetter) {
        yExtremumGetters[seriesType] = plugin.yExtremumGetter as ExtremumGetter<typeof seriesType>;
      }
    }

    return {
      seriesFormatters,
      colorProcessors,
      xExtremumGetters,
      yExtremumGetters,
    };
  }, [defaultizedPlugins]);
}
