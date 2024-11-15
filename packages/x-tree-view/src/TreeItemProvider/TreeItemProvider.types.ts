import * as React from 'react';
import { TreeViewItemId } from '../models';

export interface TreeItemProviderProps {
  children: React.ReactNode;
  itemId: TreeViewItemId;
  id: string | undefined;
}
