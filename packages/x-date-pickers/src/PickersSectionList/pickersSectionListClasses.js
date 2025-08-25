"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersSectionListClasses = void 0;
exports.getPickersSectionListUtilityClass = getPickersSectionListUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersSectionListUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersSectionList', slot);
}
exports.pickersSectionListClasses = (0, generateUtilityClasses_1.default)('MuiPickersSectionList', ['root', 'section', 'sectionContent']);
