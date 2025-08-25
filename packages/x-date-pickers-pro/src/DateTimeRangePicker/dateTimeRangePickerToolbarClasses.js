"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimeRangePickerToolbarClasses = void 0;
exports.getDateTimeRangePickerToolbarUtilityClass = getDateTimeRangePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDateTimeRangePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDateTimeRangePickerToolbar', slot);
}
exports.dateTimeRangePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiDateTimeRangePickerToolbar', ['root', 'startToolbar', 'endToolbar']);
