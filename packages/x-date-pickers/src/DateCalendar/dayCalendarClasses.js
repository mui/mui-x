"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayCalendarClasses = exports.getDayCalendarUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getDayCalendarUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiDayCalendar', slot);
};
exports.getDayCalendarUtilityClass = getDayCalendarUtilityClass;
exports.dayCalendarClasses = (0, generateUtilityClasses_1.default)('MuiDayCalendar', [
    'root',
    'header',
    'weekDayLabel',
    'loadingContainer',
    'slideTransition',
    'monthContainer',
    'weekContainer',
    'weekNumberLabel',
    'weekNumber',
]);
