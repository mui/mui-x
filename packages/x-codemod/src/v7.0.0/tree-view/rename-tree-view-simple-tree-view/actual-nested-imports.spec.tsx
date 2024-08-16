// @ts-nocheck
import * as React from 'react';
import {
  TreeView,
  TreeViewProps,
  TreeViewClasses,
  TreeViewClassKey,
  treeViewClasses,
  getTreeViewUtilityClass,
} from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

function App() {
  getTreeViewUtilityClass('root');

  return (
    <TreeView>
      <TreeItem nodeId="1" label="Item 1" />
    </TreeView>
  );
}
