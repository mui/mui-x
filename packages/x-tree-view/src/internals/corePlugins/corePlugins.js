"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TREE_VIEW_CORE_PLUGINS = void 0;
var useTreeViewInstanceEvents_1 = require("./useTreeViewInstanceEvents");
var useTreeViewOptionalPlugins_1 = require("./useTreeViewOptionalPlugins");
var useTreeViewId_1 = require("./useTreeViewId");
/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Tree View components.
 */
exports.TREE_VIEW_CORE_PLUGINS = [
    useTreeViewInstanceEvents_1.useTreeViewInstanceEvents,
    useTreeViewOptionalPlugins_1.useTreeViewOptionalPlugins,
    useTreeViewId_1.useTreeViewId,
];
