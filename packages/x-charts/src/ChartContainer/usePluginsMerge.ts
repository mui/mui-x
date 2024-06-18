import * as React from 'react';
import { ChartsPluginType, ColorProcessorsConfig, ExtremumGettersConfig } from '../models';
import { ChartSeriesType } from '../models/seriesType/config';
import { SeriesFormatterConfig } from '../context/SeriesContextProvider';
import { defaultPlugins } from './defaultPlugins';

export function usePluginsMerge<T extends ChartSeriesType>(plugins?: ChartsPluginType<T>[]) {
  const defaultizedPlugins = plugins ?? defaultPlugins;

  return React.useMemo(() => {
    const seriesFormatters: SeriesFormatterConfig<ChartSeriesType> = {};
    const colorProcessors: ColorProcessorsConfig<ChartSeriesType> = {};
    const xExtremumGetters: ExtremumGettersConfig<ChartSeriesType> = {};
    const yExtremumGetters: ExtremumGettersConfig<ChartSeriesType> = {};

    for (let i = 0; i < defaultizedPlugins.length; i += 1) {
      const plugin = defaultizedPlugins[i];

      // To remove those any we will need to solve this union discrimination issue:
      // https://www.typescriptlang.org/play/?#code/FDAuE8AcFMAIDkCuBbARtATgYQPYDsAzASwHNYBeWAb2FlgGsi8ATALlgHI8V0MOBuWrBwwMAQ1A4M7ABQAPdtzSYAlBQB8sJb0EBfEBBiwAyqAxMSuQqQrUhjFuw4BnMxYFCRmCVNkLYruZ4JGrkmoEWeiAAxviuWqhWxCTsSMrY+Mm2VAxMbLAARNqYBQA0wqI+0rByGrAATLAAVDWw+rF48YFJpOymQZaZNpQ5DvkFEcFlFd6S1bVhsAAG9S0AJFRyukttMXGgsB3JzrYA2niJQyTl3VcAugZQcADylXPOALJikJAW2ULFDAAflSPEwPRIpw4XnEcw4d1KQkmJBBJjcwQhUJhVXhiN0gmAHXi2LmXx+FnYr1mUk+31+wWy+JABCksBkABtoAcjjYcARDldnGoaCA6AB6MWwADqUnoJxw9FgRH5AHc4L9ooroGJogALQ5iZxwPJEABuRGYiDE7PASJVRFAerZPJIADoxsKhHRooa4FwwXxWF66DNYVIyfTIS73Xk7rZoySpIIQyHUBhtfRkyGfUbOMiOEGU3RExgIxZTtGxnHKAm3kng8xoAQxIh2aBC0W0xms-pvftqLkWOUS2141chBLYABJDimuB4HBKxtiWBiVA4RAHXU4FWwSSwTkHAAqxlgiBYmFcYhYAusbrGq5vtepGFX6YPTHo0GYnjrpbp5ZVrYJZ6EAA
      seriesFormatters[plugin.seriesType] = plugin.seriesFormatter as any;

      colorProcessors[plugin.seriesType] = plugin.colorProcessor as any;

      if (plugin.xExtremumGetter) {
        xExtremumGetters[plugin.seriesType] = plugin.xExtremumGetter as any;
      }

      if (plugin.yExtremumGetter) {
        yExtremumGetters[plugin.seriesType] = plugin.yExtremumGetter as any;
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
