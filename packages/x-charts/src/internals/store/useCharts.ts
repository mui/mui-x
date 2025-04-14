import * as React from 'react';
import useId from '@mui/utils/useId';
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
import { extractPluginParamsFromProps } from './extractPluginParamsFromProps';
import { ChartSeriesType } from '../../models/seriesType/config';
import { ChartSeriesConfig } from '../plugins/models/seriesConfig';
import { useChartModels } from './useChartModels';

let globalId = 0;

/**
 * This is the main hook that setups the plugin system for the chart.
 *
 * It manages the data used to create the charts.
 *
 * @param inPlugins All the plugins that will be used in the chart.
 * @param props The props passed to the chart.
 * @param seriesConfig The set of helpers used for series-specific computation.
 */
export function useCharts<
  TSeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
>(
  inPlugins: ConvertSignaturesIntoPlugins<TSignatures>,
  props: Partial<UseChartBaseProps<TSignatures>>,
  seriesConfig: ChartSeriesConfig<TSeriesType>,
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

  const models = useChartModels<TSignatures>(plugins, pluginParams);
  const instanceRef = React.useRef({} as ChartInstance<TSignatures>);
  const instance = instanceRef.current as ChartInstance<TSignatures>;
  const publicAPI = useChartApiInitialization<ChartPublicAPI<TSignatures>>(props.apiRef);
  const innerChartRootRef = React.useRef<HTMLDivElement>(null);
  const innerSvgRef = React.useRef<SVGSVGElement>(null);

  const storeRef = React.useRef<ChartStore<TSignaturesWithCorePluginSignatures> | null>(null);
  if (storeRef.current == null) {
    // eslint-disable-next-line react-compiler/react-compiler
    globalId += 1;

    const initialState = {
      cacheKey: { id: globalId },
    } as ChartState<TSignaturesWithCorePluginSignatures> & UseChartInteractionState;

    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(
          initialState,
          plugin.getInitialState(pluginParams, initialState, seriesConfig),
        );
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
      chartRootRef: innerChartRootRef,
      seriesConfig,
      models,
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
      store: storeRef.current as ChartStore<TSignaturesWithCorePluginSignatures> &
        UseChartInteractionState,
      publicAPI: publicAPI.current,
      instance,
      svgRef: innerSvgRef,
      chartRootRef: innerChartRootRef,
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
