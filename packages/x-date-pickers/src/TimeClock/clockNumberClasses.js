"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockNumberClasses = void 0;
exports.getClockNumberUtilityClass = getClockNumberUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getClockNumberUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiClockNumber', slot);
}
exports.clockNumberClasses = (0, generateUtilityClasses_1.default)('MuiClockNumber', [
    'root',
    'selected',
    'disabled',
]);
