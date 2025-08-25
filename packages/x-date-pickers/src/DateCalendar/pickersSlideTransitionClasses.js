"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersSlideTransitionClasses = exports.getPickersSlideTransitionUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getPickersSlideTransitionUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersSlideTransition', slot);
};
exports.getPickersSlideTransitionUtilityClass = getPickersSlideTransitionUtilityClass;
exports.pickersSlideTransitionClasses = (0, generateUtilityClasses_1.default)('MuiPickersSlideTransition', [
    'root',
    'slideEnter-left',
    'slideEnter-right',
    'slideEnterActive',
    'slideExit',
    'slideExitActiveLeft-left',
    'slideExitActiveLeft-right',
]);
