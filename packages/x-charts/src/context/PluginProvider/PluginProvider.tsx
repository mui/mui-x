import * as React from 'react';
import { PluginProviderProps } from './Plugin.types';
import { PluginContext } from './PluginContext';
import { mergePlugins } from './mergePlugins';

function PluginProvider(props: PluginProviderProps) {
  const { children, plugins } = props;

  const formattedSeries = React.useMemo(
    () => ({
      isInitialized: true,
      data: mergePlugins(plugins),
    }),
    [plugins],
  );

  return <PluginContext.Provider value={formattedSeries}>{children}</PluginContext.Provider>;
}

export { PluginProvider };
