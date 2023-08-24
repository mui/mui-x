import { DefaultizedProps } from '../internals/models';
import type { UseTreeViewExpansionProps } from './useTreeViewExpansion';
import type { UseTreeViewFocusProps } from './useTreeViewFocus';
import type { UseTreeViewSelectionProps } from './useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationProps } from './useTreeViewKeyboardNavigation';
import type { UseTreeViewNodesProps } from './useTreeViewNodes';

export type UseTreeViewProps = UseTreeViewNodesProps &
  UseTreeViewExpansionProps &
  UseTreeViewFocusProps &
  UseTreeViewSelectionProps &
  UseTreeViewKeyboardNavigationProps;

export type UseTreeViewDefaultizedProps = DefaultizedProps<
  UseTreeViewProps,
  | 'defaultExpanded'
  | 'defaultSelected'
  | 'disabledItemsFocusable'
  | 'disableSelection'
  | 'multiSelect'
>;
