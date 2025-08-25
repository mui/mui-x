"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersArrowSwitcherClasses = void 0;
exports.getPickersArrowSwitcherUtilityClass = getPickersArrowSwitcherUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersArrowSwitcherUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersArrowSwitcher', slot);
}
exports.pickersArrowSwitcherClasses = (0, generateUtilityClasses_1.default)('MuiPickersArrowSwitcher', [
    'root',
    'spacer',
    'button',
    'previousIconButton',
    'nextIconButton',
    'leftArrowIcon',
    'rightArrowIcon',
]);
