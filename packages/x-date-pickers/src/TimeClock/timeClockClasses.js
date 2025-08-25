"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeClockClasses = void 0;
exports.getTimeClockUtilityClass = getTimeClockUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getTimeClockUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiTimeClock', slot);
}
exports.timeClockClasses = (0, generateUtilityClasses_1.default)('MuiTimeClock', [
    'root',
    'arrowSwitcher',
]);
