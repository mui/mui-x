"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_expansion_props_1 = require("../rename-expansion-props");
var rename_selection_props_1 = require("../rename-selection-props");
var rename_focus_callback_1 = require("../rename-focus-callback");
var rename_nodeid_1 = require("../rename-nodeid");
var replace_transition_props_by_slot_1 = require("../replace-transition-props-by-slot");
var rename_use_tree_item_1 = require("../rename-use-tree-item");
var rename_tree_view_simple_tree_view_1 = require("../rename-tree-view-simple-tree-view");
function transformer(file, api, options) {
    file.source = (0, rename_expansion_props_1.default)(file, api, options);
    file.source = (0, rename_selection_props_1.default)(file, api, options);
    file.source = (0, rename_focus_callback_1.default)(file, api, options);
    file.source = (0, rename_nodeid_1.default)(file, api, options);
    file.source = (0, replace_transition_props_by_slot_1.default)(file, api, options);
    file.source = (0, rename_use_tree_item_1.default)(file, api, options);
    file.source = (0, rename_tree_view_simple_tree_view_1.default)(file, api, options);
    return file.source;
}
