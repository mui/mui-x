import * as React from 'react';
import type { MergeSignaturesProperty, OptionalIfEmpty } from './helpers';
import type { ChartCorePluginSignatures } from '../corePlugins';
import { ChartStore } from '../utils/ChartStore';
import { ChartSeriesConfig } from './seriesConfig';

export interface ChartPluginOptions<TSignature extends ChartAnyPluginSignature> {
  /**
   * An imperative api available for internal use.
   */
  instance: ChartUsedInstance<TSignature>;
  /**
   * The parameters after being processed with the default values.
   */
  params: ChartUsedDefaultizedParams<TSignature>;
  /**
   * The store that can be used to access the state of other plugins.
   */
  store: ChartUsedStore<TSignature>;
  /**
   * Reference to the main svg element.
   */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /**
   * Reference to the chart root element.
   */
  chartRootRef: React.RefObject<HTMLDivElement | null>;
  /**
   * All the plugins that are used in the chart.
   */
  plugins: ChartPlugin<ChartAnyPluginSignature>[];
  /**
   * All the series configurations that are currently loaded.
   */
  seriesConfig: ChartSeriesConfig<any>;
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
    modelNames?: keyof T['defaultizedParams'];
    dependencies?: readonly ChartAnyPluginSignature[];
    optionalDependencies?: readonly ChartAnyPluginSignature[];
  },
> = {
  /**
   * The raw properties that can be passed to the plugin.
   */
  params: T extends { params: {} } ? T['params'] : {};
  /**
   * The params after being processed with the default values.
   */
  defaultizedParams: T extends { defaultizedParams: {} } ? T['defaultizedParams'] : {};
  /**
   * An imperative api available for internal use.
   */
  instance: T extends { instance: {} } ? T['instance'] : {};
  /**
   * The state is the mutable data that will actually be stored in the plugin state and can be accessed by other plugins.
   */
  state: T extends { state: {} } ? T['state'] : {};
  /**
   * The public imperative API that will be exposed to the user.
   * Accessed through the `apiRef` property of the plugin.
   */
  publicAPI: T extends { publicAPI: {} } ? T['publicAPI'] : {};
  /**
   * Any plugins that this plugin depends on.
   */
  dependencies: T extends { dependencies: Array<any> } ? T['dependencies'] : [];
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

export type ChartUsedStore<TSignature extends ChartAnyPluginSignature> = ChartStore<
  [TSignature, ...TSignature['dependencies']],
  TSignature['optionalDependencies']
>;

export type ChartPlugin<TSignature extends ChartAnyPluginSignature> = {
  /**
   * The main function of the plugin that will be executed by the chart.
   *
   * This should be a valid React `use` function, as it will be executed in the render phase and can contain hooks.
   */
  (options: ChartPluginOptions<TSignature>): ChartResponse<TSignature>;
  /**
   * The initial state is computed after the default values are applied.
   * It set up the state for the first render.
   * Other state modifications have to be done in effects and so could not be applied on the initial render.
   *
   * @param {ChartUsedDefaultizedParams<TSignature>} params The parameters after being processed with the default values.
   * @param {MergeSignaturesProperty<ChartRequiredPlugins<TSignature>, 'state'>} currentState The current state of the chart.
   * @param {ChartSeriesConfig<any>} seriesConfig The series configuration.
   *
   * @returns {TSignature['state']} The initial state of the plugin.
   */
  getInitialState?: (
    params: ChartUsedDefaultizedParams<TSignature>,
    currentState: MergeSignaturesProperty<ChartRequiredPlugins<TSignature>, 'state'>,
    seriesConfig: ChartSeriesConfig<any>,
  ) => TSignature['state'];
  /**
   * An object where each property used by the plugin is set to `true`.
   */
  params: Record<keyof TSignature['params'], true>;
  /**
   * A function that receives the parameters and returns the parameters after being processed with the default values.
   *
   * @param {ChartUsedParams<TSignature>} options The options object.
   * @param {ChartUsedParams<TSignature>['params']} options.params The parameters before being processed with the default values.
   * @returns {TSignature['defaultizedParams']} The parameters after being processed with the default values.
   */
  getDefaultizedParams?: (options: {
    params: ChartUsedParams<TSignature>;
  }) => TSignature['defaultizedParams'];
};
