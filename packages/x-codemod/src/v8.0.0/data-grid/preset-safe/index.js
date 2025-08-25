"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var remove_stabilized_experimentalFeatures_1 = require("../remove-stabilized-experimentalFeatures");
var remove_props_1 = require("../remove-props");
var rename_props_1 = require("../rename-props");
var reform_row_selection_model_1 = require("../reform-row-selection-model");
var rename_imports_1 = require("../rename-imports");
var rename_package_1 = require("../rename-package");
var add_showToolbar_prop_1 = require("../add-showToolbar-prop");
function transformer(file, api, options) {
    file.source = (0, remove_stabilized_experimentalFeatures_1.default)(file, api, options);
    file.source = (0, rename_props_1.default)(file, api, options);
    file.source = (0, remove_props_1.default)(file, api, options);
    file.source = (0, reform_row_selection_model_1.default)(file, api, options);
    file.source = (0, rename_imports_1.default)(file, api, options);
    file.source = (0, rename_package_1.default)(file, api, options);
    file.source = (0, add_showToolbar_prop_1.default)(file, api, options);
    return file.source;
}
