"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_tree_view_simple_tree_view_1 = require("../rename-tree-view-simple-tree-view");
var rename_tree_item_2_1 = require("../rename-tree-item-2");
function transformer(file, api, options) {
    file.source = (0, rename_tree_view_simple_tree_view_1.default)(file, api, options);
    file.source = (0, rename_tree_item_2_1.default)(file, api, options);
    return file.source;
}
