"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearCalendarClasses = void 0;
exports.getYearCalendarUtilityClass = getYearCalendarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getYearCalendarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiYearCalendar', slot);
}
exports.yearCalendarClasses = (0, generateUtilityClasses_1.default)('MuiYearCalendar', [
    'root',
    'button',
    'disabled',
    'selected',
]);
