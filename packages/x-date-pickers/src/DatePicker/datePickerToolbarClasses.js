"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datePickerToolbarClasses = void 0;
exports.getDatePickerToolbarUtilityClass = getDatePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDatePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDatePickerToolbar', slot);
}
exports.datePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiDatePickerToolbar', ['root', 'title']);
