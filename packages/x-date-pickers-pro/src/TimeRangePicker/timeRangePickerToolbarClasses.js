"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeRangePickerToolbarClasses = void 0;
exports.getTimeRangePickerToolbarUtilityClass = getTimeRangePickerToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getTimeRangePickerToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiTimeRangePickerToolbar', slot);
}
exports.timeRangePickerToolbarClasses = (0, generateUtilityClasses_1.default)('MuiTimeRangePickerToolbar', ['root', 'container', 'separator', 'timeContainer']);
