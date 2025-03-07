import type { ChartAnyPluginSignature, ChartPlugin } from './plugin';

type IsAny<T> = 0 extends 1 & T ? true : false;

export type OptionalIfEmpty<A extends string, B> = keyof B extends never
  ? Partial<Record<A, B>>
  : IsAny<B> extends true
    ? Partial<Record<A, B>>
    : Record<A, B>;

export type MergeSignaturesProperty<
  TSignatures extends readonly any[],
  TProperty extends keyof ChartAnyPluginSignature,
> = TSignatures extends readonly [plugin: infer P, ...otherPlugin: infer R]
  ? P extends ChartAnyPluginSignature
    ? P[TProperty] & MergeSignaturesProperty<R, TProperty>
    : {}
  : {};

export type ConvertPluginsIntoSignatures<
  TPlugins extends readonly ChartPlugin<ChartAnyPluginSignature>[],
> = TPlugins extends readonly [plugin: infer TPlugin, ...otherPlugin: infer R]
  ? R extends readonly ChartPlugin<any>[]
    ? TPlugin extends ChartPlugin<infer TSignature>
      ? readonly [TSignature, ...ConvertPluginsIntoSignatures<R>]
      : never
    : never
  : [];

export type ConvertSignaturesIntoPlugins<TSignatures extends readonly ChartAnyPluginSignature[]> =
  TSignatures extends readonly [signature: infer TSignature, ...otherSignatures: infer R]
    ? R extends readonly ChartAnyPluginSignature[]
      ? TSignature extends ChartAnyPluginSignature
        ? readonly [ChartPlugin<TSignature>, ...ConvertSignaturesIntoPlugins<R>]
        : never
      : never
    : [];
