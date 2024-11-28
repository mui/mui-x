import * as React from 'react';
import { ChartStore } from '../plugins/utils/ChartStore';
import {
  ChartAnyPluginSignature,
  ChartInstance,
  ChartPlugin,
  ChartPublicAPI,
  ChartState,
  ConvertSignaturesIntoPlugins,
} from '../plugins/models';
import { CHART_CORE_PLUGINS, ChartCorePluginSignatures } from '../plugins/corePlugins';
import { UseChartBaseProps } from './useCharts.types';
import { UseChartInteractionState } from '../plugins/featurePlugins/useChartInteraction/useChartInteraction.types';

export function useChartApiInitialization<T>(
  inputApiRef: React.MutableRefObject<T | undefined> | undefined,
): T {
  const fallbackPublicApiRef = React.useRef({}) as React.MutableRefObject<T>;

  if (inputApiRef) {
    if (inputApiRef.current == null) {
      // eslint-disable-next-line react-compiler/react-compiler
      inputApiRef.current = {} as T;
    }
    return inputApiRef.current;
  }

  return fallbackPublicApiRef.current;
}

let globalId = 0;

export function useCharts<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TProps extends Partial<UseChartBaseProps<TSignatures>>,
>(inPlugins: ConvertSignaturesIntoPlugins<TSignatures>, props: TProps) {
  type TSignaturesWithCorePluginSignatures = readonly [
    ...ChartCorePluginSignatures,
    ...TSignatures,
  ];

  const plugins = React.useMemo(
    () =>
      [
        ...CHART_CORE_PLUGINS,
        ...inPlugins,
      ] as unknown as ConvertSignaturesIntoPlugins<TSignaturesWithCorePluginSignatures>,
    [inPlugins],
  );

  const pluginParams = {}; // To generate when plugins use params.
  const instanceRef = React.useRef({} as ChartInstance<TSignatures>);
  const instance = instanceRef.current as ChartInstance<TSignatures>;
  const publicAPI = useChartApiInitialization<ChartPublicAPI<TSignatures>>(props.apiRef);
  const innerSvgRef: React.RefObject<SVGSVGElement> = React.useRef(null);

  const storeRef = React.useRef<ChartStore<TSignaturesWithCorePluginSignatures> | null>(null);
  if (storeRef.current == null) {
    // eslint-disable-next-line react-compiler/react-compiler
    globalId += 1;

    const initialState = {
      // TODO remove when the interaction moves to plugin
      interaction: {
        item: null,
        axis: { x: null, y: null },
      },
      cacheKey: { id: globalId },
    } as ChartState<TSignaturesWithCorePluginSignatures> & UseChartInteractionState;

    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(initialState, plugin.getInitialState({}));
      }
    });
    storeRef.current = new ChartStore(initialState);
  }

  const runPlugin = (plugin: ChartPlugin<ChartAnyPluginSignature>) => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      plugins: plugins as ChartPlugin<ChartAnyPluginSignature>[],
      store: storeRef.current as ChartStore<any>,
      svgRef: innerSvgRef,
    });

    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI, pluginResponse.publicAPI);
    }

    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }
  };

  plugins.forEach(runPlugin);

  const contextValue = React.useMemo(
    () => ({
      store: storeRef.current as ChartStore<TSignaturesWithCorePluginSignatures> &
        UseChartInteractionState,
      publicAPI,
      instance,
      svgRef: innerSvgRef,
    }),
    [instance, publicAPI],
  );

  return { contextValue };
}
