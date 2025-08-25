"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var column_menu_components_rename_1 = require("../column-menu-components-rename");
var row_selection_props_rename_1 = require("../row-selection-props-rename");
var rename_rowsPerPageOptions_prop_1 = require("../rename-rowsPerPageOptions-prop");
var remove_disableExtendRowFullWidth_prop_1 = require("../remove-disableExtendRowFullWidth-prop");
var rename_linkOperators_logicOperators_1 = require("../rename-linkOperators-logicOperators");
var rename_filter_item_props_1 = require("../rename-filter-item-props");
var rename_selectors_and_events_1 = require("../rename-selectors-and-events");
var remove_stabilized_experimentalFeatures_1 = require("../remove-stabilized-experimentalFeatures");
var replace_onCellFocusOut_prop_1 = require("../replace-onCellFocusOut-prop");
function transformer(file, api, options) {
    file.source = (0, column_menu_components_rename_1.default)(file, api, options);
    file.source = (0, row_selection_props_rename_1.default)(file, api, options);
    file.source = (0, rename_rowsPerPageOptions_prop_1.default)(file, api, options);
    file.source = (0, remove_disableExtendRowFullWidth_prop_1.default)(file, api, options);
    file.source = (0, rename_linkOperators_logicOperators_1.default)(file, api, options);
    file.source = (0, rename_filter_item_props_1.default)(file, api, options);
    file.source = (0, rename_selectors_and_events_1.default)(file, api, options);
    file.source = (0, remove_stabilized_experimentalFeatures_1.default)(file, api, options);
    file.source = (0, replace_onCellFocusOut_prop_1.default)(file, api, options);
    return file.source;
}
