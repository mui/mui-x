"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayCalendarSkeletonClasses = exports.getDayCalendarSkeletonUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getDayCalendarSkeletonUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiDayCalendarSkeleton', slot);
};
exports.getDayCalendarSkeletonUtilityClass = getDayCalendarSkeletonUtilityClass;
exports.dayCalendarSkeletonClasses = (0, generateUtilityClasses_1.default)('MuiDayCalendarSkeleton', ['root', 'week', 'daySkeleton']);
