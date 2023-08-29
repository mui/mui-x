import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import type {
  UseTreeViewExpansionParameters,
  UseTreeViewExpansionDefaultizedParameters,
} from './useTreeViewExpansion';
import type {
  UseTreeViewFocusParameters,
  UseTreeViewFocusDefaultizedParameters,
} from './useTreeViewFocus';
import type {
  UseTreeViewSelectionParameters,
  UseTreeViewSelectionDefaultizedParameters,
} from './useTreeViewSelection';
import type {
  UseTreeViewNodesParameters,
  UseTreeViewNodesDefaultizedParameters,
} from './useTreeViewNodes';
import type {
  UseTreeViewContextValueBuilderParameters,
  UseTreeViewContextValueBuilderDefaultizedParameters,
} from './useTreeViewContextValueBuilder';
import type { TreeViewContextValue } from '../TreeViewProvider';
import { TreeViewAnyPluginSignature } from '../../models';

export interface UseTreeViewParameters<Multiple extends boolean | undefined>
  extends UseTreeViewNodesParameters,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewContextValueBuilderParameters {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
}

export interface UseTreeViewDefaultizedParameters<Multiple extends boolean>
  extends UseTreeViewNodesDefaultizedParameters,
    UseTreeViewExpansionDefaultizedParameters,
    UseTreeViewFocusDefaultizedParameters,
    UseTreeViewSelectionDefaultizedParameters<Multiple>,
    UseTreeViewContextValueBuilderDefaultizedParameters {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
}

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
