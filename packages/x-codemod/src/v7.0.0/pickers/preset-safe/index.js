"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_components_to_slots_1 = require("../rename-components-to-slots");
var rename_default_calendar_month_to_reference_date_1 = require("../rename-default-calendar-month-to-reference-date");
var rename_day_picker_classes_1 = require("../rename-day-picker-classes");
var rename_slots_types_1 = require("../rename-slots-types");
function transformer(file, api, options) {
    file.source = (0, rename_components_to_slots_1.default)(file, api, options);
    file.source = (0, rename_default_calendar_month_to_reference_date_1.default)(file, api, options);
    file.source = (0, rename_day_picker_classes_1.default)(file, api, options);
    file.source = (0, rename_slots_types_1.default)(file, api, options);
    return file.source;
}
