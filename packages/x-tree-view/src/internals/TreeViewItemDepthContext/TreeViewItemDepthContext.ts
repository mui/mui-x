import * as React from 'react';
import { TreeViewItemId } from '../../models';
import { TreeViewState } from '../models';
import { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';

export const TreeViewItemDepthContext = React.createContext<
  ((state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) => number) | number
>(() => -1);

if (process.env.NODE_ENV !== 'production') {
  TreeViewItemDepthContext.displayName = 'TreeViewItemDepthContext';
}
