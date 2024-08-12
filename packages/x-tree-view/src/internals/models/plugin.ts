import * as React from 'react';
import { EventHandlers } from '@mui/utils';
import { TreeViewExperimentalFeatures, TreeViewInstance, TreeViewModel } from './treeView';
import type { MergeSignaturesProperty, OptionalIfEmpty } from './helpers';
import { TreeViewEventLookupElement } from './events';
import type { TreeViewCorePluginSignatures } from '../corePlugins';
import { TreeViewItemPlugin } from './itemPlugin';
import { TreeViewItemId } from '../../models';

export interface TreeViewPluginOptions<TSignature extends TreeViewAnyPluginSignature> {
  instance: TreeViewUsedInstance<TSignature>;
  params: TreeViewUsedDefaultizedParams<TSignature>;
  state: TreeViewUsedState<TSignature>;
  slots: TSignature['slots'];
  slotProps: TSignature['slotProps'];
  experimentalFeatures: TreeViewUsedExperimentalFeatures<TSignature>;
  models: TreeViewUsedModels<TSignature>;
  setState: React.Dispatch<React.SetStateAction<TreeViewUsedState<TSignature>>>;
  rootRef: React.RefObject<HTMLUListElement>;
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
    contextValue?: {};
    slots?: { [key in keyof T['slots']]: React.ElementType };
    slotProps?: { [key in keyof T['slotProps']]: {} | (() => {}) };
    modelNames?: keyof T['defaultizedParams'];
    experimentalFeatures?: string;
    dependencies?: readonly TreeViewAnyPluginSignature[];
    optionalDependencies?: readonly TreeViewAnyPluginSignature[];
  },
> = {
  params: T extends { params: {} } ? T['params'] : {};
  defaultizedParams: T extends { defaultizedParams: {} } ? T['defaultizedParams'] : {};
  instance: T extends { instance: {} } ? T['instance'] : {};
  publicAPI: T extends { publicAPI: {} } ? T['publicAPI'] : {};
  events: T extends { events: {} } ? T['events'] : {};
  state: T extends { state: {} } ? T['state'] : {};
  contextValue: T extends { contextValue: {} } ? T['contextValue'] : {};
  slots: T extends { slots: {} } ? T['slots'] : {};
  slotProps: T extends { slotProps: {} } ? T['slotProps'] : {};
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
  dependencies: T extends { dependencies: Array<any> } ? T['dependencies'] : [];
  optionalDependencies: T extends { optionalDependencies: Array<any> }
    ? T['optionalDependencies']
    : [];
};

export type TreeViewAnyPluginSignature = {
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

type TreeViewUsedDefaultizedParams<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'defaultizedParams'>;

export type TreeViewUsedInstance<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'instance'> & {
    /**
     * Private property only defined in TypeScript to be able to access the plugin signature from the instance object.
     */
    $$signature: TSignature;
  };

type TreeViewUsedState<TSignature extends TreeViewAnyPluginSignature> =
  PluginPropertyWithDependencies<TSignature, 'state'>;

type TreeViewUsedExperimentalFeatures<TSignature extends TreeViewAnyPluginSignature> =
  TreeViewExperimentalFeatures<[TSignature, ...TSignature['dependencies']]>;

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
}) => React.ReactNode;

export type TreeRootWrapper<TSignatures extends readonly TreeViewAnyPluginSignature[]> = (params: {
  children: React.ReactNode;
  instance: TreeViewInstance<TSignatures>;
}) => React.ReactNode;

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  (options: TreeViewPluginOptions<TSignature>): TreeViewResponse<TSignature>;
  getDefaultizedParams?: (
    params: TreeViewUsedParams<TSignature>,
  ) => TSignature['defaultizedParams'];
  getInitialState?: (params: TreeViewUsedDefaultizedParams<TSignature>) => TSignature['state'];
  models?: TreeViewModelsInitializer<TSignature>;
  params: Record<keyof TSignature['params'], true>;
  itemPlugin?: TreeViewItemPlugin<any>;
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
  wrapRoot?: TreeRootWrapper<[TSignature, ...TSignature['dependencies']]>;
};
