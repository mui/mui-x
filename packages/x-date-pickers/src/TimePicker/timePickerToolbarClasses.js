"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timePickerToolbarClasses = void 0;
exports.getTimePickerToolbarUtilityClass = getTimePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getTimePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiTimePickerToolbar', slot);
}
exports.timePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiTimePickerToolbar', [
    'root',
    'separator',
    'hourMinuteLabel',
    'hourMinuteLabelLandscape',
    'hourMinuteLabelReverse',
    'ampmSelection',
    'ampmLandscape',
    'ampmLabel',
]);
