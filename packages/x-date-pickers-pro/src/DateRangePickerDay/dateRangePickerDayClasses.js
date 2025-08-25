"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangePickerDayClasses = void 0;
exports.getDateRangePickerDayUtilityClass = getDateRangePickerDayUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDateRangePickerDayUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDateRangePickerDay', slot);
}
exports.dateRangePickerDayClasses = (0, generateUtilityClasses_1.default)('MuiDateRangePickerDay', [
    'root',
    'rangeIntervalDayHighlight',
    'rangeIntervalDayHighlightStart',
    'rangeIntervalDayHighlightEnd',
    'rangeIntervalPreview',
    'rangeIntervalDayPreview',
    'rangeIntervalDayPreviewStart',
    'rangeIntervalDayPreviewEnd',
    'outsideCurrentMonth',
    'startOfMonth',
    'endOfMonth',
    'firstVisibleCell',
    'lastVisibleCell',
    'hiddenDayFiller',
    'day',
    'dayOutsideRangeInterval',
    'dayInsideRangeInterval',
    'notSelectedDate',
]);
