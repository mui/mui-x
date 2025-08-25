"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickerDay2Classes = void 0;
exports.getPickerDay2UtilityClass = getPickerDay2UtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickerDay2UtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickerDay2', slot);
}
exports.pickerDay2Classes = (0, generateUtilityClasses_1.default)('MuiPickerDay2', [
    'root',
    'dayOutsideMonth',
    'today',
    'selected',
    'disabled',
    'fillerCell',
]);
