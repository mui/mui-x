// @ts-nocheck
import * as React from 'react';
import { SimpleTreeView, simpleTreeViewClasses } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, useTreeItemState } from '@mui/x-tree-view/TreeItem';

const className = simpleTreeViewClasses.root;

// prettier-ignore
<SimpleTreeView
  expandedItems={[]}
  defaultExpandedItems={[]}
  onExpandedItemsChange={expansionCallback}
  selectedItems={null}
  defaultSelectedItems={null}
  onSelectedItemsChange={selectionCallback}
>
  <TreeItem
    itemId="1"
    label="Item 1"
    slots={{
      groupTransition: Fade,
    }}
    slotProps={{
      groupTransition: { timeout: 600 },
    }} />
</SimpleTreeView>;
