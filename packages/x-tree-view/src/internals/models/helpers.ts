import type { TreeViewAnyPluginSignature, TreeViewPlugin } from './plugin';

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

export type ConvertPluginsIntoSignatures<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = TPlugins extends readonly [plugin: infer TPlugin, ...otherPlugin: infer R]
  ? R extends readonly TreeViewPlugin<any>[]
    ? TPlugin extends TreeViewPlugin<infer TSignature>
      ? readonly [TSignature, ...ConvertPluginsIntoSignatures<R>]
      : never
    : never
  : [];

export type ConvertSignaturesIntoPlugins<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> = TSignatures extends readonly [signature: infer TSignature, ...otherSignatures: infer R]
  ? R extends readonly TreeViewAnyPluginSignature[]
    ? TSignature extends TreeViewAnyPluginSignature
      ? readonly [TreeViewPlugin<TSignature>, ...ConvertSignaturesIntoPlugins<R>]
      : never
    : never
  : [];

/**
 * Generate the classes for a given component when exposed from its parent.
 * For example, when the Tree View exposes the Tree Item classes, the classes should be prefixed with `item` except for the root.
 */
export type NestedClasses<TPrefix extends string, TClassKeys extends string> = {
  [K in TClassKeys as K extends 'root' ? TPrefix : `${TPrefix}${Capitalize<K>}`]: string;
};
