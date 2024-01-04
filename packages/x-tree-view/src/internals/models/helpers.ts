import type { TreeViewAnyPluginSignature, TreeViewPlugin } from './plugin';

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;

type IsAny<T> = 0 extends 1 & T ? true : false;

export type OptionalIfEmpty<A extends string, B> = keyof B extends never
  ? Partial<Record<A, B>>
  : IsAny<B> extends true
  ? Partial<Record<A, B>>
  : Record<A, B>;

export type MergePluginsProperty<
  TPlugins extends readonly any[],
  TProperty extends keyof TreeViewAnyPluginSignature,
> = TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
  ? P extends TreeViewAnyPluginSignature
    ? P[TProperty] & MergePluginsProperty<R, TProperty>
    : {}
  : {};

export type ConvertPluginsIntoSignatures<TPlugins extends readonly any[]> =
  TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
    ? P extends TreeViewPlugin<infer TSignature>
      ? [TSignature, ...ConvertPluginsIntoSignatures<R>]
      : ConvertPluginsIntoSignatures<R>
    : [];

export interface MergePlugins<TPlugins extends readonly any[]> {
  state: MergePluginsProperty<TPlugins, 'state'>;
  instance: MergePluginsProperty<TPlugins, 'instance'>;
  params: MergePluginsProperty<TPlugins, 'params'>;
  defaultizedParams: MergePluginsProperty<TPlugins, 'defaultizedParams'>;
  dependantPlugins: MergePluginsProperty<TPlugins, 'dependantPlugins'>;
  contextValue: MergePluginsProperty<TPlugins, 'contextValue'>;
  events: MergePluginsProperty<TPlugins, 'events'>;
  models: MergePluginsProperty<TPlugins, 'models'>;
}
