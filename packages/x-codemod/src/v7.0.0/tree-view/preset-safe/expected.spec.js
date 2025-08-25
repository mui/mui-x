"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var className = SimpleTreeView_1.simpleTreeViewClasses.root;
// prettier-ignore
<SimpleTreeView_1.SimpleTreeView expandedItems={[]} defaultExpandedItems={[]} onExpandedItemsChange={expansionCallback} selectedItems={null} defaultSelectedItems={null} onSelectedItemsChange={selectionCallback}>
  <TreeItem_1.TreeItem itemId="1" label="Item 1" slots={{
        groupTransition: Fade,
    }} slotProps={{
        groupTransition: { timeout: 600 },
    }}/>
</SimpleTreeView_1.SimpleTreeView>;
