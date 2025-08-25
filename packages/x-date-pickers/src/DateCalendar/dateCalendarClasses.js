"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateCalendarClasses = exports.getDateCalendarUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getDateCalendarUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiDateCalendar', slot);
};
exports.getDateCalendarUtilityClass = getDateCalendarUtilityClass;
exports.dateCalendarClasses = (0, generateUtilityClasses_1.default)('MuiDateCalendar', [
    'root',
    'viewTransitionContainer',
]);
