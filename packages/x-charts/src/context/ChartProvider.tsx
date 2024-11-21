'use client';
import * as React from 'react';
import { useCharts } from '../internals/store/useCharts';
import { ChartContextValue, ChartProviderProps } from './ChartProvider.types';
import { ALL_PLUGINS } from '../internals/plugins/allPlugins';
import { ConvertPluginsIntoSignatures } from '../internals/plugins/models/helpers';

/**
 * @ignore - internal component.
 */
export const ChartContext = React.createContext<ChartContextValue<any> | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartContext.displayName = 'ChartContext';
}

function ChartProvider(props: ChartProviderProps) {
  const { children } = props;

  const { contextValue } = useCharts<ConvertPluginsIntoSignatures<typeof ALL_PLUGINS>, {}>(
    ALL_PLUGINS,
    {},
  );

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
