import type * as React from 'react';
import type { TreeViewItemsReorderingAction } from '../models';

export interface TreeItemDragAndDropOverlayProps {
  action?: TreeViewItemsReorderingAction;
  style?: React.CSSProperties;
}
