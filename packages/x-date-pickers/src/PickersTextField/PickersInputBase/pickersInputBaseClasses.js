"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersInputBaseClasses = void 0;
exports.getPickersInputBaseUtilityClass = getPickersInputBaseUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersInputBaseUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersInputBase', slot);
}
exports.pickersInputBaseClasses = (0, generateUtilityClasses_1.default)('MuiPickersInputBase', [
    'root',
    'focused',
    'disabled',
    'error',
    'notchedOutline',
    'sectionContent',
    'sectionBefore',
    'sectionAfter',
    'adornedStart',
    'adornedEnd',
    'input',
    'inputSizeSmall',
    'activeBar',
]);
