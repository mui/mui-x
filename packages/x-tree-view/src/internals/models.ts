import type { TreeViewPlugin, TreeViewPluginSignature } from '../models';

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;

export type MergePluginsProperty<
  TPlugins extends readonly any[],
  TProperty extends keyof TreeViewPluginSignature<any, any, any, any, any>,
> = TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
  ? P extends TreeViewPluginSignature<any, any, any, any, any>
    ? P[TProperty] & MergePluginsProperty<R, TProperty>
    : {}
  : {};

export type ConvertPluginsIntoSignature<TPlugins extends readonly any[]> =
  TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
    ? P extends TreeViewPlugin<infer TSignature>
      ? [TSignature, ...ConvertPluginsIntoSignature<R>]
      : ConvertPluginsIntoSignature<R>
    : [];

export interface TreeViewNode {
  id: string;
  idAttribute: string | undefined;
  index: number;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean | undefined;
}

export interface TreeViewItemRange {
  start?: string | null;
  end?: string | null;
  next?: string | null;
  current?: string;
}
