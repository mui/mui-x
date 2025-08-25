"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var localization_provider_rename_locale_1 = require("../localization-provider-rename-locale");
var text_props_to_localeText_1 = require("../text-props-to-localeText");
var view_components_rename_1 = require("../view-components-rename");
var view_components_rename_value_prop_1 = require("../view-components-rename-value-prop");
var adapter_change_import_1 = require("../adapter-change-import");
var replace_tabs_props_1 = require("../replace-tabs-props");
var replace_toolbar_props_by_slot_1 = require("../replace-toolbar-props-by-slot");
var migrate_to_components_componentsProps_1 = require("../migrate-to-components-componentsProps");
var replace_arrows_button_slot_1 = require("../replace-arrows-button-slot");
var rename_should_disable_time_1 = require("../rename-should-disable-time");
var rename_inputFormat_prop_1 = require("../rename-inputFormat-prop");
var rename_default_toolbar_title_localeText_1 = require("../rename-default-toolbar-title-localeText");
function transformer(file, api, options) {
    file.source = (0, localization_provider_rename_locale_1.default)(file, api, options);
    // All the codemods impacting the view components should be run before renaming these components
    file.source = (0, text_props_to_localeText_1.default)(file, api, options);
    file.source = (0, view_components_rename_value_prop_1.default)(file, api, options);
    file.source = (0, view_components_rename_1.default)(file, api, options);
    file.source = (0, adapter_change_import_1.default)(file, api, options);
    file.source = (0, replace_tabs_props_1.default)(file, api, options);
    file.source = (0, replace_toolbar_props_by_slot_1.default)(file, api, options);
    file.source = (0, migrate_to_components_componentsProps_1.default)(file, api, options);
    file.source = (0, replace_arrows_button_slot_1.default)(file, api, options);
    file.source = (0, rename_should_disable_time_1.default)(file, api, options);
    file.source = (0, rename_inputFormat_prop_1.default)(file, api, options);
    file.source = (0, rename_default_toolbar_title_localeText_1.default)(file, api, options);
    return file.source;
}
