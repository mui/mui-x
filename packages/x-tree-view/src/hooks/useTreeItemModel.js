"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeItemModel = void 0;
var TreeViewProvider_1 = require("../internals/TreeViewProvider");
var useSelector_1 = require("../internals/hooks/useSelector");
var useTreeViewItems_selectors_1 = require("../internals/plugins/useTreeViewItems/useTreeViewItems.selectors");
var useTreeItemModel = function (itemId) {
    var store = (0, TreeViewProvider_1.useTreeViewContext)().store;
    return (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorItemModel, itemId);
};
exports.useTreeItemModel = useTreeItemModel;
