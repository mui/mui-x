"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
function App() {
    (0, SimpleTreeView_1.getSimpleTreeViewUtilityClass)('root');
    // prettier-ignore
    return (<SimpleTreeView_1.SimpleTreeView>
      <TreeItem_1.TreeItem nodeId="1" label="Item 1"/>
    </SimpleTreeView_1.SimpleTreeView>);
}
