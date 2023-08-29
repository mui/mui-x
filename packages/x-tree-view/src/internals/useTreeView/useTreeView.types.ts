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
  UseTreeViewContextParameters,
  UseTreeViewContextDefaultizedParameters,
} from './useTreeViewContext';
import type { TreeViewContextValue } from '../TreeViewProvider';

export interface UseTreeViewParameters<Multiple extends boolean | undefined>
  extends UseTreeViewNodesParameters,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewContextParameters {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
}

export interface UseTreeViewDefaultizedParameters<Multiple extends boolean>
  extends UseTreeViewNodesDefaultizedParameters,
    UseTreeViewExpansionDefaultizedParameters,
    UseTreeViewFocusDefaultizedParameters,
    UseTreeViewSelectionDefaultizedParameters<Multiple>,
    UseTreeViewContextDefaultizedParameters {
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

export interface UseTreeViewReturnValue {
  getRootProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseTreeViewRootSlotProps;
  rootRef: React.Ref<HTMLUListElement>;
  contextValue: TreeViewContextValue;
}
