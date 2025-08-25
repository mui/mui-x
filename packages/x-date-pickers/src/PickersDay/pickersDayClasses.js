"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersDayClasses = void 0;
exports.getPickersDayUtilityClass = getPickersDayUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersDayUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersDay', slot);
}
exports.pickersDayClasses = (0, generateUtilityClasses_1.default)('MuiPickersDay', [
    'root',
    'dayWithMargin',
    'dayOutsideMonth',
    'hiddenDaySpacingFiller',
    'today',
    'selected',
    'disabled',
]);
