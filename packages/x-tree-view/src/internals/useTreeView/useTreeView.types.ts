import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import type {
  UseTreeViewExpansionProps,
  UseTreeViewExpansionDefaultizedProps,
} from './useTreeViewExpansion';
import type { UseTreeViewFocusProps, UseTreeViewFocusDefaultizedProps } from './useTreeViewFocus';
import type {
  UseTreeViewSelectionProps,
  UseTreeViewSelectionDefaultizedProps,
} from './useTreeViewSelection';
import type {
  UseTreeViewKeyboardNavigationProps,
  UseTreeViewKeyboardNavigationDefaultizedProps,
} from './useTreeViewKeyboardNavigation';
import type { UseTreeViewNodesProps, UseTreeViewNodesDefaultizedProps } from './useTreeViewNodes';
import type {
  UseTreeViewContextProps,
  UseTreeViewContextDefaultizedProps,
} from './useTreeViewContext';

export interface UseTreeViewProps<Multiple extends boolean | undefined>
  extends UseTreeViewNodesProps,
    UseTreeViewExpansionProps,
    UseTreeViewFocusProps,
    UseTreeViewSelectionProps<Multiple>,
    UseTreeViewKeyboardNavigationProps,
    UseTreeViewContextProps {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
}

export interface UseTreeViewDefaultizedProps<Multiple extends boolean>
  extends UseTreeViewNodesDefaultizedProps,
    UseTreeViewExpansionDefaultizedProps,
    UseTreeViewFocusDefaultizedProps,
    UseTreeViewSelectionDefaultizedProps<Multiple>,
    UseTreeViewKeyboardNavigationDefaultizedProps,
    UseTreeViewContextDefaultizedProps {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
}

export type UseTreeViewRootPropsGetter = <TOther extends EventHandlers = {}>(
  otherHandlers?: TOther,
) => React.HTMLAttributes<HTMLUListElement> & TOther;
