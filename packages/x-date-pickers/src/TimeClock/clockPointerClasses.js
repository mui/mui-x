"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockPointerClasses = void 0;
exports.getClockPointerUtilityClass = getClockPointerUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getClockPointerUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiClockPointer', slot);
}
exports.clockPointerClasses = (0, generateUtilityClasses_1.default)('MuiClockPointer', [
    'root',
    'thumb',
]);
