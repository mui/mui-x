import * as React from 'react';
import { DefaultizedProps } from '../models';
import type { UseTreeViewExpansionProps } from './useTreeViewExpansion';
import type { UseTreeViewFocusProps } from './useTreeViewFocus';
import type { UseTreeViewSelectionProps } from './useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationProps } from './useTreeViewKeyboardNavigation';
import type { UseTreeViewNodesProps } from './useTreeViewNodes';

export interface UseTreeViewProps<Multiple extends boolean | undefined>
  extends UseTreeViewNodesProps,
    UseTreeViewExpansionProps,
    UseTreeViewFocusProps,
    UseTreeViewSelectionProps<Multiple>,
    UseTreeViewKeyboardNavigationProps {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
}

export type UseTreeViewDefaultizedProps<Multiple extends boolean> = DefaultizedProps<
  UseTreeViewProps<Multiple>,
  | 'defaultExpanded'
  | 'defaultSelected'
  | 'disabledItemsFocusable'
  | 'disableSelection'
  | 'multiSelect'
>;
