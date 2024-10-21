import {
  SimpleTreeViewProps,
  SimpleTreeViewSlotProps,
  SimpleTreeViewSlots,
} from '../SimpleTreeView';

export interface TreeViewProps<Multiple extends boolean | undefined>
  extends SimpleTreeViewProps<Multiple> {}

export interface TreeViewSlots extends SimpleTreeViewSlots {}

export interface TreeViewSlotProps extends SimpleTreeViewSlotProps {}

export type SingleSelectTreeViewProps = SimpleTreeViewProps<false>;
export type MultiSelectTreeViewProps = SimpleTreeViewProps<true>;
