import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewModel } from './treeView';
import type { MergePluginsProperty, OptionalIfEmpty } from './helpers';
import { TreeViewEventLookupElement } from './events';
import type { TreeViewCorePluginsSignature } from '../corePlugins';
import type { TreeItemProps } from '../../TreeItem';

export interface TreeViewPluginOptions<TSignature extends TreeViewAnyPluginSignature> {
  instance: TreeViewUsedInstance<TSignature>;
  publicAPI: TreeViewUsedPublicAPI<TSignature>;
  params: TreeViewUsedDefaultizedParams<TSignature>;
  state: TreeViewUsedState<TSignature>;
  slots: TSignature['slots'];
  slotProps: TSignature['slotProps'];
  models: TreeViewUsedModels<TSignature>;
  setState: React.Dispatch<React.SetStateAction<TreeViewUsedState<TSignature>>>;
  rootRef: React.RefObject<HTMLUListElement>;
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
} & OptionalIfEmpty<'contextValue', TSignature['contextValue']>;

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
    dependantPlugins?: readonly TreeViewAnyPluginSignature[];
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
  dependantPlugins: T extends { dependantPlugins: Array<any> } ? T['dependantPlugins'] : [];
};

export type TreeViewAnyPluginSignature = {
  state: any;
  instance: any;
  params: any;
  defaultizedParams: any;
  dependantPlugins: any;
  events: any;
  contextValue: any;
  slots: any;
  slotProps: any;
  models: any;
  publicAPI: any;
};

type TreeViewUsedPlugins<TSignature extends TreeViewAnyPluginSignature> = [
  TreeViewCorePluginsSignature,
  ...TSignature['dependantPlugins'],
];

type TreeViewUsedParams<TSignature extends TreeViewAnyPluginSignature> = TSignature['params'] &
  MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'params'>;

type TreeViewUsedDefaultizedParams<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['defaultizedParams'] &
    MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'defaultizedParams'>;

export type TreeViewUsedInstance<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['instance'] &
    MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'instance'> & {
      /**
       * Private property only defined in TypeScript to be able to access the plugin signature from the instance object.
       */
      $$signature: TSignature;
    };

export type TreeViewUsedPublicAPI<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['publicAPI'] &
    MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'publicAPI'> & {
      /**
       * Private property only defined in TypeScript to be able to access the plugin signature from the publicAPI object.
       */
      $$signature: TSignature;
    };

type TreeViewUsedState<TSignature extends TreeViewAnyPluginSignature> = TSignature['state'] &
  MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'state'>;

type RemoveSetValue<Models extends Record<string, TreeViewModel<any>>> = {
  [K in keyof Models]: Omit<Models[K], 'setValue'>;
};

export type TreeViewUsedModels<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['models'] &
    RemoveSetValue<MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'models'>>;

export type TreeViewUsedEvents<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['events'] & MergePluginsProperty<TreeViewUsedPlugins<TSignature>, 'events'>;

export interface TreeViewItemPluginOptions {
  props: TreeItemProps;
  ref: React.Ref<HTMLLIElement>;
}

export interface TreeViewItemPluginResponse {
  /**
   * Props enriched by the plugin.
   */
  props?: TreeItemProps;
  /**
   * Ref enriched by the plugin
   */
  ref?: React.Ref<HTMLLIElement>;
  /**
   * Render function used to add React wrappers around the TreeItem.
   * @param {React.ReactNode} children The TreeItem node before this plugin execution.
   * @returns {React.ReactNode} The wrapped TreeItem.
   */
  wrapItem?: (children: React.ReactNode) => React.ReactNode;
}

export type TreeViewItemPlugin = (
  options: TreeViewItemPluginOptions,
) => void | TreeViewItemPluginResponse;

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  (options: TreeViewPluginOptions<TSignature>): void | TreeViewResponse<TSignature>;
  getDefaultizedParams?: (
    params: TreeViewUsedParams<TSignature>,
  ) => TSignature['defaultizedParams'];
  getInitialState?: (params: TreeViewUsedDefaultizedParams<TSignature>) => TSignature['state'];
  models?: TreeViewModelsInitializer<TSignature>;
  params: Record<keyof TSignature['params'], true>;
  itemPlugin?: TreeViewItemPlugin;
};
