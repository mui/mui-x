import type { TreeViewAnyPluginSignature, TreeViewPlugin } from './plugin';

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;

export type SlotComponentPropsFromProps<
  TProps extends {},
  TOverrides extends {},
  TOwnerState extends {},
> = (Partial<TProps> & TOverrides) | ((ownerState: TOwnerState) => Partial<TProps> & TOverrides);

type IsAny<T> = 0 extends 1 & T ? true : false;

export type OptionalIfEmpty<A extends string, B> = keyof B extends never
  ? Partial<Record<A, B>>
  : IsAny<B> extends true
    ? Partial<Record<A, B>>
    : Record<A, B>;

export type MergeSignaturesProperty<
  TSignatures extends readonly any[],
  TProperty extends keyof TreeViewAnyPluginSignature,
> = TSignatures extends readonly [plugin: infer P, ...otherPlugin: infer R]
  ? P extends TreeViewAnyPluginSignature
    ? P[TProperty] & MergeSignaturesProperty<R, TProperty>
    : {}
  : {};

export type ConvertPluginsIntoSignatures<TPlugins extends readonly any[]> =
  TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
    ? P extends TreeViewPlugin<infer TSignature>
      ? readonly [TSignature, ...ConvertPluginsIntoSignatures<R>]
      : ConvertPluginsIntoSignatures<R>
    : readonly [];

export type ConvertSignaturesIntoPlugins<TSignatures extends readonly any[]> =
  TSignatures extends readonly [plugin: infer S, ...otherPlugin: infer R]
    ? S extends TreeViewAnyPluginSignature
      ? readonly [TreeViewPlugin<S>, ...ConvertSignaturesIntoPlugins<R>]
      : ConvertSignaturesIntoPlugins<R>
    : readonly [];
