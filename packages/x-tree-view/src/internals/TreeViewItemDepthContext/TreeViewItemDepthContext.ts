import * as React from 'react';
import { TreeViewItemId } from '../../models';

export const TreeViewItemDepthContext = React.createContext<
  number | ((itemId: TreeViewItemId) => number)
>(() => -1);

if (process.env.NODE_ENV !== 'production') {
  TreeViewItemDepthContext.displayName = 'TreeViewItemDepthContext';
}
