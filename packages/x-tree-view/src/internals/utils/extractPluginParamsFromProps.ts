import * as React from 'react';
import { ConvertPluginsIntoSignatures, MergePluginsProperty, TreeViewPlugin } from '../models';

export const extractPluginParamsFromProps = <
  TProps extends {},
  TPlugins extends readonly TreeViewPlugin<any>[],
>({
  props,
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

  const pluginParams = { plugins, rootRef } as PluginParams & {
    plugins: TPlugins;
    rootRef?: React.Ref<HTMLUListElement>;
  };
  const otherProps = {} as Omit<TProps, keyof PluginParams>;

  Object.keys(props).forEach((propName) => {
    const prop = props[propName as keyof typeof props] as any;

    if (paramsLookup[propName as keyof PluginParams]) {
      pluginParams[propName as keyof PluginParams] = prop;
    } else {
      otherProps[propName as keyof typeof otherProps] = prop;
    }
  });

  return { pluginParams, otherProps };
};
