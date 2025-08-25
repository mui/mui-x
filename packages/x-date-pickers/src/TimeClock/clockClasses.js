"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockClasses = void 0;
exports.getClockUtilityClass = getClockUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getClockUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiClock', slot);
}
exports.clockClasses = (0, generateUtilityClasses_1.default)('MuiClock', [
    'root',
    'clock',
    'wrapper',
    'squareMask',
    'pin',
    'amButton',
    'pmButton',
    'meridiemText',
    'selected',
]);
