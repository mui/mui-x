import * as React from 'react';
import { EventHandlers } from '@mui/utils/types';
import { TreeViewExperimentalFeatures, TreeViewInstance, TreeViewModel } from './treeView';
import type { MergeSignaturesProperty, OptionalIfEmpty } from './helpers';
import { TreeViewEventLookupElement } from './events';
import type { TreeViewCorePluginSignatures } from '../corePlugins';
import { TreeViewItemPlugin } from './itemPlugin';
import { TreeViewItemId } from '../../models';
import { TreeViewStore } from '../utils/TreeViewStore';

export interface TreeViewPluginOptions<TSignature extends TreeViewAnyPluginSignature> {
  /**
   * An imperative API available for internal use. Used to access methods from other plugins.
   */
  instance: TreeViewUsedInstance<TSignature>;
  /**
   * The parameters after being processed with the default values.
   */
  params: TreeViewUsedDefaultizedParams<TSignature>;
  slots: TSignature['slots'];
  slotProps: TSignature['slotProps'];
  experimentalFeatures: TreeViewUsedExperimentalFeatures<TSignature>;
  /**
   * The store of controlled properties.
   * If they are not controlled by the user, they will be initialized by the plugin.
   */
  models: TreeViewUsedModels<TSignature>;
  /**
   * The store that can be used to access the state of other plugins.
   */
  store: TreeViewUsedStore<TSignature>;
  /**
   * Reference to the root element.
   */
  rootRef: React.RefObject<HTMLUListElement | null>;
  /**
   * All the plugins that are used in the tree-view.
   */
  plugins: TreeViewPlugin<TreeViewAnyPluginSignature>[];
}

type TreeViewModelsInitializer<TSignature extends TreeViewAnyPluginSignature> = {
  [TControlled in keyof TSignature['models']]: {
    getDefaultValue: (
      params: TSignature['defaultizedParams'],
    ) => Exclude<TSignature['defaultizedParams'][TControlled], undefined>;
  };
};

type TreeViewResponse<TSignature extends TreeViewAnyPluginSignature> = {
  getRootProps?: <TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>;
} & OptionalIfEmpty<'publicAPI', TSignature['publicAPI']> &
  OptionalIfEmpty<'instance', TSignature['instance']> &
  OptionalIfEmpty<'contextValue', TSignature['contextValue']>;

export type TreeViewPluginSignature<
  T extends {
    params?: {};
    defaultizedParams?: {};
    instance?: {};
    publicAPI?: {};
    events?: { [key in keyof T['events']]: TreeViewEventLookupElement };
    state?: {};
    cache?: {};
    contextValue?: {};
    slots?: { [key in keyof T['slots']]: React.ElementType };
    slotProps?: { [key in keyof T['slotProps']]: {} | (() => {}) };
    modelNames?: keyof T['defaultizedParams'];
    experimentalFeatures?: string;
    dependencies?: readonly TreeViewAnyPluginSignature[];
    optionalDependencies?: readonly TreeViewAnyPluginSignature[];
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
   * The public imperative API that will be exposed to the user.
   * Accessed through the `apiRef` property of the plugin.
   */
  publicAPI: T extends { publicAPI: {} } ? T['publicAPI'] : {};
  events: T extends { events: {} } ? T['events'] : {};
  /**
   * The state is the mutable data that will actually be stored in the plugin state and can be accessed by other plugins.
   */
  state: T extends { state: {} } ? T['state'] : {};
  cache: T extends { cache: {} } ? T['cache'] : {};
  contextValue: T extends { contextValue: {} } ? T['contextValue'] : {};
  slots: T extends { slots: {} } ? T['slots'] : {};
  slotProps: T extends { slotProps: {} } ? T['slotProps'] : {};
  /**
   * A helper for controlled properties.
   * Properties defined here can be controlled by the user. If they are not controlled, they will be initialized by the plugin.
   */
  models: T extends { defaultizedParams: {}; modelNames: keyof T['defaultizedParams'] }
    ? {
        [TControlled in T['modelNames']]-?: TreeViewModel<
          Exclude<T['defaultizedParams'][TControlled], undefined>
        >;
      }
    : {};
  experimentalFeatures: T extends { experimentalFeatures: string }
    ? { [key in T['experimentalFeatures']]?: boolean }
    : {};
  /**
   * Any plugins that this plugin depends on.
   */
  dependencies: T extends { dependencies: Array<any> } ? T['dependencies'] : [];
  /**
   * Same as dependencies but the plugin might not have been initialized. Used for dependencies on plugins of features that can be enabled conditionally.
   */
  optionalDependencies: T extends { optionalDependencies: Array<any> }
    ? T['optionalDependencies']
    : [];
};

export type TreeViewAnyPluginSignature = {
  cache: any;
  state: any;
  instance: any;
  params: any;
  defaultizedParams: any;
  dependencies: any;
  optionalDependencies: any;
  events: any;
  contextValue: any;
  slots: any;
  slotProps: any;
  models: any;
  experimentalFeatures: any;
  publicAPI: any;
};

type TreeViewRequiredPlugins<TSignature extends TreeViewAnyPluginSignature> = [
  ...TreeViewCorePluginSignatures,
  ...TSignature['dependencies'],
];

type PluginPropertyWithDependencies<
  TSignature extends TreeViewAnyPluginSignature,
  TProperty extends keyof TreeViewAnyPluginSignature,
> = TSignature[TProperty] &
  MergeSignaturesProperty<TreeViewRequiredPlugins<TSignature>, TProperty> &
  Partial<MergeSignaturesProperty<TSignature['optionalDependencies'], TProperty>>;

export type TreeViewUsedParams<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'params'>;

export type TreeViewUsedDefaultizedParams<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'defaultizedParams'>;

export type TreeViewUsedInstance<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'instance'> & {
    /**
     * Private property only defined in TypeScript to be able to access the plugin signature from the instance object.
     */
    $$signature: TSignature;
  };

export type TreeViewUsedStore<TSignature extends TreeViewAnyPluginSignature> = TreeViewStore<
  [TSignature, ...TSignature['dependencies']]
>;

type TreeViewUsedExperimentalFeatures<TSignature extends TreeViewAnyPluginSignature> =
  TreeViewExperimentalFeatures<
    [TSignature, ...TSignature['dependencies']],
    TSignature['optionalDependencies']
  >;

type RemoveSetValue<Models extends Record<string, TreeViewModel<any>>> = {
  [K in keyof Models]: Omit<Models[K], 'setValue'>;
};

export type TreeViewUsedModels<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['models'] &
    RemoveSetValue<MergeSignaturesProperty<TreeViewRequiredPlugins<TSignature>, 'models'>>;

export type TreeViewUsedEvents<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['events'] & MergeSignaturesProperty<TreeViewRequiredPlugins<TSignature>, 'events'>;

export type TreeItemWrapper<TSignatures extends readonly TreeViewAnyPluginSignature[]> = (params: {
  itemId: TreeViewItemId;
  children: React.ReactNode;
  instance: TreeViewInstance<TSignatures>;
  idAttribute: string;
}) => React.ReactNode;

export type TreeRootWrapper = (params: { children: React.ReactNode }) => React.ReactNode;

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  /**
   * The main function of the plugin that will be executed by the Tree View.
   *
   * This should be a valid React `use` function, as it will be executed in the render phase and can contain hooks.
   */
  (options: TreeViewPluginOptions<TSignature>): TreeViewResponse<TSignature>;
  /**
   * A function that receives the parameters and returns them after being processed with the default values.
   *
   * @param {TreeViewUsedParams<TSignature>} options The options object.
   * @param {TreeViewUsedParams<TSignature>['params']} options.params The parameters before being processed with the default values.
   * @param {TreeViewUsedExperimentalFeatures<TSignature>} options.experimentalFeatures An object containing the experimental feature flags.
   * @returns {TSignature['defaultizedParams']} The parameters after being processed with the default values.
   */
  getDefaultizedParams?: (options: {
    params: TreeViewUsedParams<TSignature>;
    experimentalFeatures: TreeViewUsedExperimentalFeatures<TSignature>;
  }) => TSignature['defaultizedParams'];
  /**
   * The initial state is computed after the default values are applied.
   * It sets up the state for the first render.
   * Other state modifications have to be done in effects and so could not be applied on the initial render.
   *
   * @param {TreeViewUsedDefaultizedParams<TSignature>} params The parameters after being processed with the default values.
   * @returns {TSignature['state']} The initial state of the plugin.
   */
  getInitialState?: (params: TreeViewUsedDefaultizedParams<TSignature>) => TSignature['state'];
  getInitialCache?: () => TSignature['cache'];
  /**
   * The configuration of properties that can be controlled by the user.
   * If they are not controlled, they will be initialized by the plugin.
   */
  models?: TreeViewModelsInitializer<TSignature>;
  /**
   * An object where each property used by the plugin is set to `true`.
   */
  params: Record<keyof TSignature['params'], true>;
  itemPlugin?: TreeViewItemPlugin;
  /**
   * Render function used to add React wrappers around the TreeItem.
   * @param {{ nodeId: TreeViewItemId; children: React.ReactNode; }} params The params of the item.
   * @returns {React.ReactNode} The wrapped item.
   */
  wrapItem?: TreeItemWrapper<[TSignature, ...TSignature['dependencies']]>;
  /**
   * Render function used to add React wrappers around the TreeView.
   * @param {{ children: React.ReactNode; }} params The params of the root.
   * @returns {React.ReactNode} The wrapped root.
   */
  wrapRoot?: TreeRootWrapper;
};
