import * as React from 'react';
import { TreeViewContextValue } from './TreeViewProvider.types';

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext<TreeViewContextValue<any> | null>(null);

if (process.env.NODE_ENV !== 'production') {
  TreeViewContext.displayName = 'TreeViewContext';
}
