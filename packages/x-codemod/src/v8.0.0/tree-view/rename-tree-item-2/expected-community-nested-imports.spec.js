"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var useTreeItem_1 = require("@mui/x-tree-view/useTreeItem");
var hooks_1 = require("@mui/x-tree-view/hooks");
var TreeItemProvider_1 = require("@mui/x-tree-view/TreeItemProvider");
var TreeItemIcon_1 = require("@mui/x-tree-view/TreeItemIcon");
var TreeItemDragAndDropOverlay_1 = require("@mui/x-tree-view/TreeItemDragAndDropOverlay");
var TreeItemLabelInput_1 = require("@mui/x-tree-view/TreeItemLabelInput");
// prettier-ignore
function App() {
    (0, useTreeItem_1.useTreeItem)({});
    (0, useTreeItem_1.useTreeItem)({});
    (0, hooks_1.useTreeItemUtils)();
    var treeItemProps = {};
    var treeItemSlots = {};
    var treeItemSlotProps = {};
    var params = {};
    var returnValue = {};
    var status = {};
    var root = {};
    var content = {};
    var labelInput = {};
    var label = {};
    var checkbox = {};
    var iconContainer = {};
    var groupTransition = {};
    var dragAndDropOverlay = {};
    var treeItemProviderProps = {};
    var treeItemIconProps = {};
    var treeItemDragAndDropOverlayProps = {};
    var treeItemLabelInputProps = {};
    return (<React.Fragment>
      <TreeItem_1.TreeItem />
      <TreeItem_1.TreeItemRoot />
      <TreeItem_1.TreeItemContent />
      <TreeItem_1.TreeItemIconContainer />
      <TreeItem_1.TreeItemGroupTransition />
      <TreeItem_1.TreeItemCheckbox />
      <TreeItem_1.TreeItemLabel />
      <TreeItemProvider_1.TreeItemProvider />
      <TreeItemIcon_1.TreeItemIcon />
      <TreeItemDragAndDropOverlay_1.TreeItemDragAndDropOverlay />
      <TreeItemLabelInput_1.TreeItemLabelInput />
    </React.Fragment>);
}
