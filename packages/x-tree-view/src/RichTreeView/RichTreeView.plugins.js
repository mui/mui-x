"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RICH_TREE_VIEW_PLUGINS = void 0;
var useTreeViewItems_1 = require("../internals/plugins/useTreeViewItems");
var useTreeViewExpansion_1 = require("../internals/plugins/useTreeViewExpansion");
var useTreeViewSelection_1 = require("../internals/plugins/useTreeViewSelection");
var useTreeViewFocus_1 = require("../internals/plugins/useTreeViewFocus");
var useTreeViewKeyboardNavigation_1 = require("../internals/plugins/useTreeViewKeyboardNavigation");
var useTreeViewLabel_1 = require("../internals/plugins/useTreeViewLabel");
exports.RICH_TREE_VIEW_PLUGINS = [
    useTreeViewItems_1.useTreeViewItems,
    useTreeViewExpansion_1.useTreeViewExpansion,
    useTreeViewSelection_1.useTreeViewSelection,
    useTreeViewFocus_1.useTreeViewFocus,
    useTreeViewKeyboardNavigation_1.useTreeViewKeyboardNavigation,
    useTreeViewLabel_1.useTreeViewLabel,
];
