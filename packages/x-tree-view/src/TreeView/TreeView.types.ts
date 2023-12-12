import { SimpleTreeViewProps } from '../SimpleTreeView';

export interface TreeViewProps<Multiple extends boolean | undefined>
  extends SimpleTreeViewProps<Multiple> {}

export type SingleSelectTreeViewProps = SimpleTreeViewProps<false>;
export type MultiSelectTreeViewProps = SimpleTreeViewProps<true>;
