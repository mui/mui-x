import * as React from 'react';
import { TreeViewContextValue } from './TreeView.types';

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext<TreeViewContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  TreeViewContext.displayName = 'TreeViewContext';
}

export const useTreeViewContext = () => {
  const context = React.useContext(TreeViewContext);
  if (context == null) {
    throw new Error('MUI: The TreeItem component must always be used inside a TreeView component');
  }

  return context;
};
