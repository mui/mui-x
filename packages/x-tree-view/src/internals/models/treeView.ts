import { TreeViewValidItem } from '../../models';
import { MinimalTreeViewPublicAPI, MinimalTreeViewStore } from '../MinimalTreeViewStore';

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

export interface TreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  PublicAPI extends MinimalTreeViewPublicAPI<R, Multiple>,
> extends Omit<MinimalTreeViewStore<R, Multiple, any, any>, 'buildPublicAPI'> {
  buildPublicAPI(): PublicAPI;
}

export type TreeViewPublicAPI<TStore extends TreeViewStore<any, any, any>> =
  TStore extends TreeViewStore<any, any, infer TPublicAPI> ? TPublicAPI : never;
