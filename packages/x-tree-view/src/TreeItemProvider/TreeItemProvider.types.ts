import type * as React from 'react';
import type { TreeViewItemId } from '../models';

export interface TreeItemProviderProps {
  children: React.ReactNode;
  itemId: TreeViewItemId;
  id: string | undefined;
}
