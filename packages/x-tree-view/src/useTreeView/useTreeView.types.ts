import { DefaultizedProps } from '../internals/models';
import type { UseTreeViewExpansionProps } from './useTreeViewExpansion';
import type { UseTreeViewFocusProps } from './useTreeViewFocus';
import type { UseTreeViewSelectionProps } from './useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationProps } from './useTreeViewKeyboardNavigation';
import type { UseTreeViewNodesProps } from './useTreeViewNodes';

export type UseTreeViewProps<Multiple extends boolean | undefined> = UseTreeViewNodesProps &
  UseTreeViewExpansionProps &
  UseTreeViewFocusProps &
  UseTreeViewSelectionProps<Multiple> &
  UseTreeViewKeyboardNavigationProps;

export type UseTreeViewDefaultizedProps<Multiple extends boolean> = DefaultizedProps<
  UseTreeViewProps<Multiple>,
  | 'defaultExpanded'
  | 'defaultSelected'
  | 'disabledItemsFocusable'
  | 'disableSelection'
  | 'multiSelect'
>;
