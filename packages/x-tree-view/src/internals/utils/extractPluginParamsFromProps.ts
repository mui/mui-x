import * as React from 'react';
import { ConvertPluginsIntoSignatures, MergePluginsProperty, TreeViewPlugin } from '../models';
import { UseTreeViewBaseParameters } from '../useTreeView/useTreeView.types';

export const extractPluginParamsFromProps = <
  TPlugins extends readonly TreeViewPlugin<any>[],
  TSlots extends MergePluginsProperty<TPlugins, 'slots'>,
  TSlotProps extends MergePluginsProperty<TPlugins, 'slotProps'>,
  TProps extends { slots?: TSlots; slotProps?: TSlotProps },
>({
  props: { slots, slotProps, ...props },
  plugins,
  rootRef,
}: {
  props: TProps;
  plugins: TPlugins;
  rootRef?: React.Ref<HTMLUListElement>;
}) => {
  type PluginParams = MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'params'>;

  const paramsLookup = {} as Record<keyof PluginParams, true>;
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });

  const pluginParams = {
    plugins,
    rootRef,
    slots: slots ?? {},
    slotProps: slotProps ?? {},
  } as UseTreeViewBaseParameters<TPlugins> & PluginParams;
  const otherProps = {} as Omit<TProps, keyof PluginParams>;

  Object.keys(props).forEach((propName) => {
    const prop = props[propName as keyof typeof props] as any;

    if (paramsLookup[propName as keyof PluginParams]) {
      pluginParams[propName as keyof PluginParams] = prop;
    } else {
      otherProps[propName as keyof typeof otherProps] = prop;
    }
  });

  return { pluginParams, slots, slotProps, otherProps };
};
