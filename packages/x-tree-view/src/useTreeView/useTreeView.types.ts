import { DefaultizedProps } from '../internals/models';
import type { UseTreeViewExpansionProps } from './useTreeViewExpansion';
import type { UseTreeViewFocusProps } from './useTreeViewFocus';
import type {
  UseTreeViewSelectionProps,
  UseTreeViewSingleSelectProps,
  UseTreeViewMultiSelectProps,
} from './useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationProps } from './useTreeViewKeyboardNavigation';
import type { UseTreeViewNodesProps } from './useTreeViewNodes';

export type UseTreeViewProps = UseTreeViewNodesProps &
  UseTreeViewExpansionProps &
  UseTreeViewFocusProps &
  UseTreeViewSelectionProps &
  UseTreeViewKeyboardNavigationProps;

export type UseSingleSelectTreeViewProps = Omit<
  UseTreeViewProps,
  keyof UseTreeViewMultiSelectProps
> &
  UseTreeViewSingleSelectProps;
export type UseMultiSelectTreeViewProps = Omit<
  UseTreeViewProps,
  keyof UseSingleSelectTreeViewProps
> &
  UseTreeViewMultiSelectProps;

export type UseTreeViewDefaultizedProps = DefaultizedProps<
  UseTreeViewProps,
  | 'defaultExpanded'
  | 'defaultSelected'
  | 'disabledItemsFocusable'
  | 'disableSelection'
  | 'multiSelect'
>;
