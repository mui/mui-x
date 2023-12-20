import * as React from 'react';
import { MergePluginsProperty, TreeViewPlugin } from '../models';

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
  const paramsLookup = { rootRef: true };
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });

  type PluginParams = MergePluginsProperty<TPlugins, 'params'>;

  const pluginParams = { plugins, rootRef } as PluginParams & {
    plugins: TPlugins;
    rootRef?: React.Ref<HTMLUListElement>;
  };
  const otherProps = {} as Omit<TProps, keyof PluginParams>;

  Object.keys(props).forEach((propName) => {
    if (paramsLookup[propName]) {
      pluginParams[propName] = props[propName];
    } else {
      otherProps[propName] = props[propName];
    }
  });

  return { pluginParams, otherProps };
};
