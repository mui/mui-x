import {
  MinimalTreeViewParameters,
  MinimalTreeViewPublicAPI,
  MinimalTreeViewState,
} from '../MinimalTreeViewStore';

export interface SimpleTreeViewState<Multiple extends boolean | undefined>
  extends MinimalTreeViewState<SimpleTreeViewItem, Multiple> {}

export interface InnerSimpleTreeViewParameters<Multiple extends boolean | undefined>
  extends MinimalTreeViewParameters<SimpleTreeViewItem, Multiple> {}

export interface SimpleTreeViewParameters<Multiple extends boolean | undefined>
  extends Omit<
    InnerSimpleTreeViewParameters<Multiple>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemChildren' | 'getItemId'
  > {}

export interface SimpleTreeViewPublicAPI<Multiple extends boolean | undefined>
  extends MinimalTreeViewPublicAPI<SimpleTreeViewItem, Multiple> {}

export interface SimpleTreeViewItem {
  id: string;
  label: string;
  children?: SimpleTreeViewItem[];
}
