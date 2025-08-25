"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeCalendarClasses = exports.getDateRangeCalendarUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getDateRangeCalendarUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiDateRangeCalendar', slot);
};
exports.getDateRangeCalendarUtilityClass = getDateRangeCalendarUtilityClass;
exports.dateRangeCalendarClasses = (0, generateUtilityClasses_1.default)('MuiDateRangeCalendar', ['root', 'monthContainer', 'dayDragging']);
