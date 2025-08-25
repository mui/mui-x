"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_components_to_slots_1 = require("../rename-components-to-slots");
var rename_cell_selection_props_1 = require("../rename-cell-selection-props");
var remove_stabilized_experimentalFeatures_1 = require("../remove-stabilized-experimentalFeatures");
function transformer(file, api, options) {
    file.source = (0, rename_components_to_slots_1.default)(file, api, options);
    file.source = (0, rename_cell_selection_props_1.default)(file, api, options);
    file.source = (0, remove_stabilized_experimentalFeatures_1.default)(file, api, options);
    return file.source;
}
