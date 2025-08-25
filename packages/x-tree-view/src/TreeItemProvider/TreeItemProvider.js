"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItemProvider = TreeItemProvider;
var React = require("react");
var prop_types_1 = require("prop-types");
var TreeViewProvider_1 = require("../internals/TreeViewProvider");
var useTreeViewId_utils_1 = require("../internals/corePlugins/useTreeViewId/useTreeViewId.utils");
var useSelector_1 = require("../internals/hooks/useSelector");
var useTreeViewId_selectors_1 = require("../internals/corePlugins/useTreeViewId/useTreeViewId.selectors");
function TreeItemProvider(props) {
    var children = props.children, itemId = props.itemId, id = props.id;
    var _a = (0, TreeViewProvider_1.useTreeViewContext)(), wrapItem = _a.wrapItem, instance = _a.instance, store = _a.store;
    var treeId = (0, useSelector_1.useSelector)(store, useTreeViewId_selectors_1.selectorTreeViewId);
    var idAttribute = (0, useTreeViewId_utils_1.generateTreeItemIdAttribute)({ itemId: itemId, treeId: treeId, id: id });
    return <React.Fragment>{wrapItem({ children: children, itemId: itemId, instance: instance, idAttribute: idAttribute })}</React.Fragment>;
}
TreeItemProvider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    id: prop_types_1.default.string,
    itemId: prop_types_1.default.string.isRequired,
};
