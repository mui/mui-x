"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimePickerToolbarClasses = void 0;
exports.getDateTimePickerToolbarUtilityClass = getDateTimePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDateTimePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDateTimePickerToolbar', slot);
}
exports.dateTimePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiDateTimePickerToolbar', [
    'root',
    'dateContainer',
    'timeContainer',
    'timeDigitsContainer',
    'separator',
    'timeLabelReverse',
    'ampmSelection',
    'ampmLandscape',
    'ampmLabel',
]);
