"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RICH_TREE_VIEW_PRO_PLUGINS = void 0;
var internals_1 = require("@mui/x-tree-view/internals");
var useTreeViewItemsReordering_1 = require("../internals/plugins/useTreeViewItemsReordering");
var useTreeViewLazyLoading_1 = require("../internals/plugins/useTreeViewLazyLoading");
exports.RICH_TREE_VIEW_PRO_PLUGINS = [
    internals_1.useTreeViewItems,
    internals_1.useTreeViewExpansion,
    internals_1.useTreeViewSelection,
    internals_1.useTreeViewFocus,
    internals_1.useTreeViewKeyboardNavigation,
    internals_1.useTreeViewLabel,
    useTreeViewLazyLoading_1.useTreeViewLazyLoading,
    useTreeViewItemsReordering_1.useTreeViewItemsReordering,
];
