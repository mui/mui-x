'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';
import { ChartAnyPluginSignature } from '../../internals/plugins/models';

function ChartProvider<TSignatures extends readonly ChartAnyPluginSignature[]>(
  props: ChartProviderProps<TSignatures>,
) {
  const { children, plugins = [], pluginParams } = props;

  const { contextValue } = useCharts(plugins, pluginParams);

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
