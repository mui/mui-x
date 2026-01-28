'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { Store } from '@mui/x-internals/store';
import {
  type ChartAnyPluginSignature,
  type ChartInstance,
  type ChartPlugin,
  type ChartPublicAPI,
  type ChartState,
  type ConvertSignaturesIntoPlugins,
} from '../plugins/models';
import { CHART_CORE_PLUGINS, type ChartCorePluginSignatures } from '../plugins/corePlugins';
import { type UseChartBaseProps } from './useCharts.types';
import { type UseChartInteractionState } from '../plugins/featurePlugins/useChartInteraction/useChartInteraction.types';
import { extractPluginParamsFromProps } from './extractPluginParamsFromProps';

let globalId = 0;

/**
 * This is the main hook that setups the plugin system for the chart.
 *
 * It manages the data used to create the charts.
 *
 * @param inPlugins All the plugins that will be used in the chart.
 * @param props The props passed to the chart.
 */
export function useCharts<TSignatures extends readonly ChartAnyPluginSignature[] = []>(
  inPlugins: ConvertSignaturesIntoPlugins<TSignatures>,
  props: Partial<UseChartBaseProps<TSignatures>>,
) {
  type TSignaturesWithCorePluginSignatures = readonly [
    ...ChartCorePluginSignatures,
    ...TSignatures,
  ];

  const chartId = useId();

  const plugins = React.useMemo(
    () =>
      [
        ...CHART_CORE_PLUGINS,
        ...inPlugins,
      ] as unknown as ConvertSignaturesIntoPlugins<TSignaturesWithCorePluginSignatures>,
    [inPlugins],
  );

  const pluginParams = extractPluginParamsFromProps<TSignatures, typeof props>({
    plugins,
    props,
  });
  pluginParams.id = pluginParams.id ?? chartId;

  const instanceRef = React.useRef({} as ChartInstance<TSignatures>);
  const instance = instanceRef.current as ChartInstance<TSignatures>;
  const publicAPI = useChartApiInitialization<ChartPublicAPI<TSignatures>>(props.apiRef);

  const storeRef = React.useRef<Store<ChartState<TSignaturesWithCorePluginSignatures>>>(null);
  if (storeRef.current == null) {
    // eslint-disable-next-line react-compiler/react-compiler
    globalId += 1;

    const initialState = {
      cacheKey: { id: globalId },
    } as ChartState<TSignaturesWithCorePluginSignatures> & UseChartInteractionState;

    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(initialState, plugin.getInitialState(pluginParams, initialState));
      }
    });
    storeRef.current = new Store<ChartState<TSignaturesWithCorePluginSignatures>>(initialState);
  }

  const runPlugin = (plugin: ChartPlugin<ChartAnyPluginSignature>) => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      plugins: plugins as ChartPlugin<ChartAnyPluginSignature>[],
      store: storeRef.current as Store<
        ChartState<TSignaturesWithCorePluginSignatures> & UseChartInteractionState
      >,
    });

    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI.current, pluginResponse.publicAPI);
    }

    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }
  };

  plugins.forEach(runPlugin);

  const contextValue = React.useMemo(
    () => ({
      store: storeRef.current!,
      publicAPI: publicAPI.current,
      instance,
    }),
    [instance, publicAPI],
  );

  return { contextValue };
}

function initializeInputApiRef<T>(inputApiRef: React.RefObject<T | undefined>) {
  if (inputApiRef.current == null) {
    inputApiRef.current = {} as T;
  }
  return inputApiRef as React.RefObject<T>;
}

export function useChartApiInitialization<T>(
  inputApiRef: React.RefObject<T | undefined> | undefined,
): React.RefObject<T> {
  const fallbackPublicApiRef = React.useRef({}) as React.RefObject<T>;

  if (inputApiRef) {
    return initializeInputApiRef(inputApiRef);
  }

  return fallbackPublicApiRef;
}
