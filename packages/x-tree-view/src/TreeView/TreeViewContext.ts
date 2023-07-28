import * as React from 'react';
import { TreeViewContextValue } from './TreeView.types';

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext<TreeViewContextValue>({
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
});

if (process.env.NODE_ENV !== 'production') {
  TreeViewContext.displayName = 'TreeViewContext';
}
