import * as React from 'react';
import { TreeViewItemsReorderingAction } from '../models';

export interface TreeItemDragAndDropOverlayProps {
  action?: TreeViewItemsReorderingAction;
  style?: React.CSSProperties;
}
