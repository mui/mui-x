import * as React from 'react';
import { TreeItemForwardedClasses } from '../../TreeItem/treeItemClasses';

export interface TreeViewClasses extends TreeItemForwardedClasses {
  /** Styles applied to the root element. */
  root: string;
}

/**
 * @ignore - internal component.
 */
export const TreeViewClassesContext = React.createContext<Partial<TreeViewClasses>>({});

if (process.env.NODE_ENV !== 'production') {
  TreeViewClassesContext.displayName = 'TreeViewItemClassesContext';
}

export const useTreeViewClassesContext = () => {
  return React.useContext(TreeViewClassesContext);
};
