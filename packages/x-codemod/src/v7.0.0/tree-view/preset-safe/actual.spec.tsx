// @ts-nocheck
import * as React from 'react';
import { TreeView, treeViewClasses } from '@mui/x-tree-view/TreeView';
import { TreeItem, useTreeItem } from '@mui/x-tree-view/TreeItem';

const className = treeViewClasses.root;

<TreeView
  expanded={[]}
  defaultExpanded={[]}
  onNodeToggle={expansionCallback}
  selected={null}
  defaultSelected={null}
  onNodeSelect={selectionCallback}
>
  <TreeItem nodeId="1" label="Item 1" />
</TreeView>;
