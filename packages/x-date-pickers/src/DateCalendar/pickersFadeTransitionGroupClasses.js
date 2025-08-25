"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersFadeTransitionGroupClasses = exports.getPickersFadeTransitionGroupUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getPickersFadeTransitionGroupUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersFadeTransitionGroup', slot);
};
exports.getPickersFadeTransitionGroupUtilityClass = getPickersFadeTransitionGroupUtilityClass;
exports.pickersFadeTransitionGroupClasses = (0, generateUtilityClasses_1.default)('MuiPickersFadeTransitionGroup', ['root']);
