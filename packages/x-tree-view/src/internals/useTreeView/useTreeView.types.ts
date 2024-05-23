import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import type { TreeViewContextValue } from '../TreeViewProvider';
import {
  TreeViewAnyPluginSignature,
  TreeViewPlugin,
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
  TreeViewInstance,
  TreeViewPublicAPI,
  TreeViewExperimentalFeatures,
} from '../models';

export type UseTreeViewParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = UseTreeViewBaseParameters<TPlugins> &
  MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'params'>;

export interface UseTreeViewBaseParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> {
  apiRef:
    | React.MutableRefObject<TreeViewPublicAPI<ConvertPluginsIntoSignatures<TPlugins>>>
    | undefined;
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: TPlugins;
  slots: MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'slots'>;
  slotProps: MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'slotProps'>;
  experimentalFeatures: TreeViewExperimentalFeatures<ConvertPluginsIntoSignatures<TPlugins>>;
}

export type UseTreeViewDefaultizedParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = UseTreeViewBaseParameters<TPlugins> &
  MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'defaultizedParams'>;

export interface UseTreeViewRootSlotProps
  extends Pick<
    React.HTMLAttributes<HTMLUListElement>,
    'onFocus' | 'onBlur' | 'onKeyDown' | 'id' | 'aria-multiselectable' | 'role' | 'tabIndex'
  > {
  ref: React.Ref<HTMLUListElement>;
}

export interface UseTreeViewReturnValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  getRootProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseTreeViewRootSlotProps;
  rootRef: React.RefCallback<HTMLUListElement> | null;
  contextValue: TreeViewContextValue<TPlugins>;
  instance: TreeViewInstance<TPlugins>;
}
