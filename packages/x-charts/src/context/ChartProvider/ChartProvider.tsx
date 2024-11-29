'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';
import { ChartAnyPluginSignature } from '../../internals/plugins/models';
import { ChartSeriesConfig } from '../../internals/plugins/models/seriesConfig';
import { plugin as barPlugin } from '../../BarChart/plugin';
import { plugin as scatterPlugin } from '../../ScatterChart/plugin';
import { plugin as linePlugin } from '../../LineChart/plugin';
import { plugin as piePlugin } from '../../PieChart/plugin';
import { ChartSeriesType } from '../../models/seriesType/config';

export const defaultSeriesConfig: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'> = {
  bar: barPlugin,
  scatter: scatterPlugin,
  line: linePlugin,
  pie: piePlugin,
};

function ChartProvider<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TSeriesType extends ChartSeriesType,
>(props: ChartProviderProps<TSignatures, TSeriesType>) {
  const { children, plugins = [], pluginParams = {}, seriesConfig = defaultSeriesConfig } = props;

  const { contextValue } = useCharts(plugins, pluginParams, seriesConfig);

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
