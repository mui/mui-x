'use client';
import * as React from 'react';

export interface TreeItemLoaderContextValue {
  /**
   * Depth of the loading rows.
   * `0` for the whole-tree loading UI, parent depth + 1 for the children of a lazily loading item.
   */
  itemDepth: number;
  /**
   * Fixed height of the rows, from the `itemHeight` prop of the tree.
   */
  itemHeight: number | null;
  /**
   * Whether each row renders a checkbox placeholder.
   */
  isCheckboxSelectionEnabled: boolean;
}

/**
 * Provides the layout information of the surrounding tree to `TreeItemLoader`.
 * The loading UI renders outside of the tree items, so the depth and height
 * cannot be derived from an item.
 *
 * @ignore - internal context.
 */
export const TreeItemLoaderContext = React.createContext<TreeItemLoaderContextValue>({
  itemDepth: 0,
  itemHeight: null,
  isCheckboxSelectionEnabled: false,
});
