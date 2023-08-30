import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import type { TreeViewContextValue } from '../TreeViewProvider';
import {
  TreeViewAnyPluginSignature,
  TreeViewPlugin,
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
} from '../models';

export type UseTreeViewParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: TPlugins;
} & MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'params'>;

export type UseTreeViewDefaultizedParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: TPlugins;
} & MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'defaultizedParams'>;

export interface UseTreeViewRootSlotProps
  extends Pick<
    React.HTMLAttributes<HTMLUListElement>,
    | 'onFocus'
    | 'onBlur'
    | 'onKeyDown'
    | 'id'
    | 'aria-activedescendant'
    | 'aria-multiselectable'
    | 'role'
    | 'tabIndex'
  > {
  ref: React.Ref<HTMLUListElement>;
}

export interface UseTreeViewReturnValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  getRootProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseTreeViewRootSlotProps;
  rootRef: React.Ref<HTMLUListElement>;
  contextValue: TreeViewContextValue<TPlugins>;
}
