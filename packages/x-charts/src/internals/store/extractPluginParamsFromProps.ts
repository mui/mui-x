import { ChartCorePluginSignatures } from '../plugins/corePlugins';
import {
  ChartAnyPluginSignature,
  ChartPlugin,
  ChartPluginSignature,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
} from '../plugins/models';
import { UseChartBaseProps } from './useCharts.types';

export const extractPluginParamsFromProps = <
  TSignatures extends readonly ChartPluginSignature<any>[],
  TProps extends Partial<UseChartBaseProps<TSignatures>>,
>({
  props: { apiRef, ...props },
  plugins,
}: {
  props: TProps;
  plugins: ConvertSignaturesIntoPlugins<readonly [...ChartCorePluginSignatures, ...TSignatures]>;
}) => {
  type PluginParams = MergeSignaturesProperty<TSignatures, 'params'>;

  const paramsLookup = {} as Record<keyof PluginParams, true>;
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });

  const pluginParams = {} as PluginParams;

  Object.keys(props).forEach((propName) => {
    const prop = props[propName as keyof typeof props] as any;

    if (paramsLookup[propName as keyof PluginParams]) {
      pluginParams[propName as keyof PluginParams] = prop;
    }
  });

  const defaultizedPluginParams = plugins.reduce(
    (acc, plugin: ChartPlugin<ChartAnyPluginSignature>) => {
      if (plugin.getDefaultizedParams) {
        return plugin.getDefaultizedParams({ params: acc });
      }

      return acc;
    },
    pluginParams,
  ) as unknown as MergeSignaturesProperty<TSignatures, 'defaultizedParams'>;

  return defaultizedPluginParams;
};
