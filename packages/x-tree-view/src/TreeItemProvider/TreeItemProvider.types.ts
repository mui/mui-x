import type * as React from 'react';
import type { TreeViewItemId } from '../models';

export interface TreeItemProviderProps {
  /**
   * The content of the component.
   */
  children: React.ReactNode;
  /**
   * The id of the item.
   */
  itemId: TreeViewItemId;
  /**
   * The id attribute of the item.
   */
  id: string | undefined;
}
