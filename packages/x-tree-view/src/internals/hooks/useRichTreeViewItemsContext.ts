import * as React from 'react';
import type { TreeViewItemToRenderProps } from '../plugins/useTreeViewItems';

export const RichTreeViewItemsContext = React.createContext<
  ((item: TreeViewItemToRenderProps) => React.ReactNode) | null
>(null);

if (process.env.NODE_ENV !== 'production') {
  RichTreeViewItemsContext.displayName = 'RichTreeViewItemsProvider';
}

export const useRichTreeViewItemsContext = () => React.useContext(RichTreeViewItemsContext);
