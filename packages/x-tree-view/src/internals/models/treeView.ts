import * as React from 'react';
import { MinimalTreeViewStore } from '../MinimalTreeViewStore';

export interface TreeViewItemMeta {
  id: string;
  idAttribute: string | undefined;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean;
  selectable: boolean;
  /**
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   */
  depth?: number;
  /**
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   * Can be a `React.ReactNode` when `getItemLabel` returns a node.
   * String labels are used for keyboard type-ahead; non-string labels are skipped.
   */
  label?: React.ReactNode;
}

export interface TreeViewAnyStore extends MinimalTreeViewStore<any, any, any, any> {
  itemPluginManager: any;
}

export type TreeViewPublicAPI<TStore extends TreeViewAnyStore> = ReturnType<
  TStore['buildPublicAPI']
>;
