import * as React from 'react';

import type { MergeSignaturesProperty, OptionalIfEmpty } from './helpers';
import type { ChartCorePluginSignatures } from '../corePlugins';
import { ChartStore } from '../utils/ChartStore';

export interface ChartPluginOptions<TSignature extends ChartAnyPluginSignature> {
  instance: ChartUsedInstance<TSignature>;
  params: ChartUsedDefaultizedParams<TSignature>;
  store: ChartUsedStore<TSignature>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  plugins: ChartPlugin<ChartAnyPluginSignature>[];
}

type ChartResponse<TSignature extends ChartAnyPluginSignature> = OptionalIfEmpty<
  'publicAPI',
  TSignature['publicAPI']
> &
  OptionalIfEmpty<'instance', TSignature['instance']>;

export type ChartPluginSignature<
  T extends {
    params?: {};
    defaultizedParams?: {};
    instance?: {};
    publicAPI?: {};
    state?: {};
    dependencies?: readonly ChartAnyPluginSignature[];
    optionalDependencies?: readonly ChartAnyPluginSignature[];
  },
> = {
  params: T extends { params: {} } ? T['params'] : {};
  defaultizedParams: T extends { defaultizedParams: {} } ? T['defaultizedParams'] : {};
  instance: T extends { instance: {} } ? T['instance'] : {};
  state: T extends { state: {} } ? T['state'] : {};
  publicAPI: T extends { publicAPI: {} } ? T['publicAPI'] : {};
  dependencies: T extends { dependencies: Array<any> } ? T['dependencies'] : [];
  optionalDependencies: T extends { optionalDependencies: Array<any> }
    ? T['optionalDependencies']
    : [];
};

export type ChartAnyPluginSignature = {
  state: any;
  instance: any;
  params: any;
  defaultizedParams: any;
  dependencies: any;
  optionalDependencies: any;
  publicAPI: any;
};

type ChartRequiredPlugins<TSignature extends ChartAnyPluginSignature> = [
  ...ChartCorePluginSignatures,
  ...TSignature['dependencies'],
];

type PluginPropertyWithDependencies<
  TSignature extends ChartAnyPluginSignature,
  TProperty extends keyof ChartAnyPluginSignature,
> = TSignature[TProperty] &
  MergeSignaturesProperty<ChartRequiredPlugins<TSignature>, TProperty> &
  Partial<MergeSignaturesProperty<TSignature['optionalDependencies'], TProperty>>;

export type ChartUsedParams<TSignature extends ChartAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'params'>;

type ChartUsedDefaultizedParams<TSignature extends ChartAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'defaultizedParams'>;

export type ChartUsedInstance<TSignature extends ChartAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'instance'> & {
    /**
     * Private property only defined in TypeScript to be able to access the plugin signature from the instance object.
     */
    $$signature: TSignature;
  };

export type ChartUsedStore<TSignature extends ChartAnyPluginSignature> = ChartStore<
  [TSignature, ...TSignature['dependencies']]
>;

export type ChartPlugin<TSignature extends ChartAnyPluginSignature> = {
  (options: ChartPluginOptions<TSignature>): ChartResponse<TSignature>;
  getInitialState?: (params: ChartUsedDefaultizedParams<TSignature>) => TSignature['state'];
  params: Record<keyof TSignature['params'], true>;
};
