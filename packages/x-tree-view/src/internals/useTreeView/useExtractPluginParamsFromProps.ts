import * as React from 'react';
import {
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  TreeViewAnyPluginSignature,
  TreeViewPlugin,
  TreeViewPluginSignature,
} from '../models';
import { UseTreeViewBaseProps } from './useTreeView.types';
import { TreeViewCorePluginSignatures } from '../corePlugins';

export const useExtractPluginParamsFromProps = <
  TSignatures extends readonly TreeViewPluginSignature<any>[],
  TProps extends Partial<UseTreeViewBaseProps<TSignatures>>,
>({
  props: { apiRef, ...props },
  plugins,
}: ExtractPluginParamsFromPropsParameters<
  TSignatures,
  TProps
>): ExtractPluginParamsFromPropsReturnValue<TSignatures, TProps> => {
  type PluginParams = MergeSignaturesProperty<TSignatures, 'params'>;

  const paramsLookup = React.useMemo(() => {
    const tempParamsLookup = {} as Record<keyof PluginParams, true>;
    plugins.forEach((plugin) => {
      Object.assign(tempParamsLookup, plugin.params);
    });
    return tempParamsLookup;
  }, [plugins]);

  const { forwardedProps, pluginParams } = React.useMemo(() => {
    const tempPluginParams = {} as PluginParams;
    const tempForwardedProps = {} as Omit<TProps, keyof PluginParams>;

    Object.keys(props).forEach((propName) => {
      const prop = props[propName as keyof typeof props] as any;

      if (paramsLookup[propName as keyof PluginParams]) {
        tempPluginParams[propName as keyof PluginParams] = prop;
      } else {
        tempForwardedProps[propName as keyof typeof tempForwardedProps] = prop;
      }
    });

    const pluginParamsWithDefaults = plugins.reduce(
      (acc, plugin: TreeViewPlugin<TreeViewAnyPluginSignature>) => {
        if (plugin.applyDefaultValuesToParams) {
          return plugin.applyDefaultValuesToParams({
            params: acc,
          });
        }

        return acc;
      },
      tempPluginParams,
    ) as unknown as MergeSignaturesProperty<TSignatures, 'paramsWithDefaults'>;

    return {
      forwardedProps: tempForwardedProps,
      pluginParams: pluginParamsWithDefaults,
    };
  }, [plugins, props, paramsLookup]);

  return { forwardedProps, pluginParams, apiRef };
};

interface ExtractPluginParamsFromPropsParameters<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TProps extends Partial<UseTreeViewBaseProps<TSignatures>>,
> {
  plugins: ConvertSignaturesIntoPlugins<readonly [...TreeViewCorePluginSignatures, ...TSignatures]>;
  props: TProps;
}

interface ExtractPluginParamsFromPropsReturnValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TProps extends Partial<UseTreeViewBaseProps<TSignatures>>,
> extends UseTreeViewBaseProps<TSignatures> {
  pluginParams: MergeSignaturesProperty<TSignatures, 'paramsWithDefaults'>;
  forwardedProps: Omit<TProps, keyof MergeSignaturesProperty<TSignatures, 'params'>>;
}
