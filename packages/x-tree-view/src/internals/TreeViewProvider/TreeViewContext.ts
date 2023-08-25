import * as React from 'react';
import { TreeViewContextValue } from './TreeViewProvider.types';

export const DEFAULT_TREE_VIEW_CONTEXT_VALUE: TreeViewContextValue = {
  registerNode: () => {},
  unregisterNode: () => {},
  isFocused: () => false,
  isSelected: () => false,
  isExpanded: () => false,
  isExpandable: () => false,
  isDisabled: () => false,
  mapFirstChar: () => {},
  unMapFirstChar: () => {},
  focus: () => {},
  toggleExpansion: () => {},
  selectNode: () => {},
  selectRange: () => {},
  multiSelect: false,
  disabledItemsFocusable: false,
  treeId: undefined,
  icons: {
    defaultCollapseIcon: null,
    defaultExpandIcon: null,
    defaultParentIcon: null,
    defaultEndIcon: null,
  },
};

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext<TreeViewContextValue>(
  DEFAULT_TREE_VIEW_CONTEXT_VALUE,
);

if (process.env.NODE_ENV !== 'production') {
  TreeViewContext.displayName = 'TreeViewContext';
}
