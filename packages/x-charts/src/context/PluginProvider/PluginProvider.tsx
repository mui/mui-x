import * as React from 'react';
import { PluginProviderProps } from './Plugin.types';
import { PluginContext } from './PluginContext';

function PluginProvider(props: PluginProviderProps) {
  const { children } = props;

  const formattedSeries = React.useMemo(
    () => ({
      isInitialized: true,
      data: {},
    }),
    [],
  );

  return <PluginContext.Provider value={formattedSeries}>{children}</PluginContext.Provider>;
}

export { PluginProvider };
