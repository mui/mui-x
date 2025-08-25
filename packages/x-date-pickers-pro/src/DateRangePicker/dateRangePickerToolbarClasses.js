"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangePickerToolbarClasses = void 0;
exports.getDateRangePickerToolbarUtilityClass = getDateRangePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDateRangePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDateRangePickerToolbar', slot);
}
exports.dateRangePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiDateRangePickerToolbar', ['root', 'container']);
