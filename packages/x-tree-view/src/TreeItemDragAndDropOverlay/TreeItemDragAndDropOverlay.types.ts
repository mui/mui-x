import type * as React from 'react';
import type { TreeViewItemsReorderingAction } from '../models';

export interface TreeItemDragAndDropOverlayProps {
  /**
   * The reordering action that would happen if the dragged item is dropped here.
   */
  action?: TreeViewItemsReorderingAction;
  style?: React.CSSProperties;
}
