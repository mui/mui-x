// @ts-nocheck
import * as React from 'react';
import { SimpleTreeView, simpleTreeViewClasses } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, useTreeItemState } from '@mui/x-tree-view/TreeItem';

const className = simpleTreeViewClasses.root;

// prettier-ignore
<SimpleTreeView
  expandedNodes={[]}
  defaultExpandedNodes={[]}
  onExpandedNodesChange={expansionCallback}
  selectedNodes={null}
  defaultSelectedNodes={null}
  onSelectedNodesChange={selectionCallback}
>
  <TreeItem
    nodeId="1"
    label="Item 1"
    slots={{
      groupTransition: Fade,
    }}
    slotProps={{
      groupTransition: { timeout: 600 },
    }} />
</SimpleTreeView>;
