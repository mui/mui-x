"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthCalendarClasses = void 0;
exports.getMonthCalendarUtilityClass = getMonthCalendarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getMonthCalendarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiMonthCalendar', slot);
}
exports.monthCalendarClasses = (0, generateUtilityClasses_1.default)('MuiMonthCalendar', ['root', 'button', 'disabled', 'selected']);
