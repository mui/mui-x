import * as React from 'react';
import { TreeViewItemId } from '../../models';

export interface TreeItemProviderProps {
  children: React.ReactNode;
  nodeId: TreeViewItemId;
}
