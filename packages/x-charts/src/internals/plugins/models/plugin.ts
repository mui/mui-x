import * as React from 'react';
import type { MergeSignaturesProperty, OptionalIfEmpty } from './helpers';
import type { ChartCorePluginSignatures } from '../corePlugins';
import { ChartStore } from '../utils/ChartStore';
import { ChartSeriesConfig } from './seriesConfig';

export interface ChartPluginOptions<TSignature extends ChartAnyPluginSignature> {
  instance: ChartUsedInstance<TSignature>;
  params: ChartUsedDefaultizedParams<TSignature>;
  models: ChartUsedControlModels<TSignature>;
  store: ChartUsedStore<TSignature>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  plugins: ChartPlugin<ChartAnyPluginSignature>[];
  seriesConfig: ChartSeriesConfig<any>;
}

type ChartControlModelsInitializer<TSignature extends ChartAnyPluginSignature> = {
  [TControlled in keyof TSignature['models']]: {
    getDefaultValue: (
      params: TSignature['defaultizedParams'],
    ) => Exclude<TSignature['defaultizedParams'][TControlled], undefined>;
  };
};

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
    modelNames?: keyof T['defaultizedParams'];
    dependencies?: readonly ChartAnyPluginSignature[];
    optionalDependencies?: readonly ChartAnyPluginSignature[];
  },
> = {
  /**
   * The properties that can be passed to the plugin.
   */
  params: T extends { params: {} } ? T['params'] : {};
  /**
   * The params after being processed with the default values.
   */
  defaultizedParams: T extends { defaultizedParams: {} } ? T['defaultizedParams'] : {};
  /**
   * The instance methods of the plugin.
   */
  instance: T extends { instance: {} } ? T['instance'] : {};
  /**
   * The state is the data that will actually be stored in the plugin state and can be accessed by other plugins.
   */
  state: T extends { state: {} } ? T['state'] : {};
  // TODO: What is the difference between publicAPI and instance?
  /**
   * The public API is the data that will be exposed to the user.
   *
   */
  publicAPI: T extends { publicAPI: {} } ? T['publicAPI'] : {};
  // TODO: ??
  models: T extends { defaultizedParams: {}; modelNames: keyof T['defaultizedParams'] }
    ? {
        [TControlled in T['modelNames']]-?: ChartControlModel<
          Exclude<T['defaultizedParams'][TControlled], undefined>
        >;
      }
    : {};
  // TODO: ??
  /**
   * Any plugins that this plugin depends on. Will be used to merge the states of the plugins.
   */
  dependencies: T extends { dependencies: Array<any> } ? T['dependencies'] : [];
  // TODO: ??
  /**
   * Same as dependencies but the plugin might not have been initialized.
   */
  optionalDependencies: T extends { optionalDependencies: Array<any> }
    ? T['optionalDependencies']
    : [];
};

export type ChartAnyPluginSignature = ChartPluginSignature<{
  params: any;
  defaultizedParams: any;
  instance: any;
  publicAPI: any;
  state: any;
  modelNames: any;
  dependencies: any;
  optionalDependencies: any;
}>;

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

export type ChartUsedParams<TSignature extends ChartAnyPluginSignature> = MergeSignaturesProperty<
  TSignature['dependencies'],
  'defaultizedParams'
> &
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

export interface ChartControlModel<TValue> {
  name: string;
  value: TValue;
  setControlledValue: (value: TValue | ((prevValue: TValue) => TValue)) => void;
  isControlled: boolean;
}

type RemoveSetValue<Models extends Record<string, ChartControlModel<any>>> = {
  [K in keyof Models]: Omit<Models[K], 'setValue'>;
};

export type ChartUsedControlModels<TSignature extends ChartAnyPluginSignature> =
  TSignature['models'] &
    RemoveSetValue<MergeSignaturesProperty<ChartRequiredPlugins<TSignature>, 'models'>>;

export type ChartUsedStore<TSignature extends ChartAnyPluginSignature> = ChartStore<
  [TSignature, ...TSignature['dependencies']]
>;

export type ChartPlugin<TSignature extends ChartAnyPluginSignature> = {
  (options: ChartPluginOptions<TSignature>): ChartResponse<TSignature>;
  getInitialState?: (
    params: ChartUsedDefaultizedParams<TSignature>,
    currentState: MergeSignaturesProperty<ChartRequiredPlugins<TSignature>, 'state'>,
    seriesConfig: ChartSeriesConfig<any>,
  ) => TSignature['state'];
  models?: ChartControlModelsInitializer<TSignature>;
  params: Record<keyof TSignature['params'], true>;
  getDefaultizedParams?: (options: {
    params: ChartUsedParams<TSignature>;
  }) => TSignature['defaultizedParams'];
};
