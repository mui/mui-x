"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickerPopperClasses = void 0;
exports.getPickerPopperUtilityClass = getPickerPopperUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickerPopperUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickerPopper', slot);
}
exports.pickerPopperClasses = (0, generateUtilityClasses_1.default)('MuiPickerPopper', ['root', 'paper']);
