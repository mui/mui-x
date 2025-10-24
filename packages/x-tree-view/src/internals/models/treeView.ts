import { TreeViewValidItem } from '../../models';
import { MinimalTreeViewStore } from '../MinimalTreeViewStore';

export interface TreeViewItemMeta {
  id: string;
  idAttribute: string | undefined;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean;
  /**
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   */
  depth?: number;
  /**
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   */
  label?: string;
}

export interface TreeViewStore<R extends TreeViewValidItem<R>, Multiple extends boolean | undefined>
  extends MinimalTreeViewStore<R, Multiple, any, any> {}

export type TreeViewPublicAPI<TStore extends TreeViewStore<any, any>> = ReturnType<
  TStore['buildPublicAPI']
>;
