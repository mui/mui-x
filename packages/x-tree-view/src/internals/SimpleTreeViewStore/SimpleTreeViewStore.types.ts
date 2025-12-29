import { MinimalTreeViewParameters, MinimalTreeViewState } from '../MinimalTreeViewStore';

export interface SimpleTreeViewState<
  Multiple extends boolean | undefined,
> extends MinimalTreeViewState<SimpleTreeViewItem, Multiple> {}

export interface InnerSimpleTreeViewParameters<
  Multiple extends boolean | undefined,
> extends MinimalTreeViewParameters<SimpleTreeViewItem, Multiple> {}

export interface SimpleTreeViewStoreParameters<Multiple extends boolean | undefined> extends Omit<
  InnerSimpleTreeViewParameters<Multiple>,
  | 'items'
  | 'isItemDisabled'
  | 'isItemSelectionDisabled'
  | 'getItemLabel'
  | 'getItemChildren'
  | 'getItemId'
> {}

export interface SimpleTreeViewItem {
  id: string;
  label: string;
  children?: SimpleTreeViewItem[];
}
