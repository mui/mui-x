import { ChartsPlugin } from './Plugin.types';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesFormatter, SeriesFormatterConfig } from './SeriesFormatter.types';
import { ColorProcessor, ColorProcessorsConfig } from './ColorProcessor.types';
import { ExtremumGetter, ExtremumGettersConfig } from './ExtremumGetter.types';
import { plugin as barPlugin } from '../../BarChart/plugin';
import { plugin as scatterPlugin } from '../../ScatterChart/plugin';
import { plugin as linePlugin } from '../../LineChart/plugin';
import { plugin as piePlugin } from '../../PieChart/plugin';

export const defaultPlugins = [barPlugin, scatterPlugin, linePlugin, piePlugin];

export function mergePlugins(plugins?: ChartsPlugin<ChartSeriesType>[]) {
  const defaultizedPlugins = plugins ?? defaultPlugins;

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
}
