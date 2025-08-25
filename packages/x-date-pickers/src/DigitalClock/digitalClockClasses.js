"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalClockClasses = void 0;
exports.getDigitalClockUtilityClass = getDigitalClockUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getDigitalClockUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiDigitalClock', slot);
}
exports.digitalClockClasses = (0, generateUtilityClasses_1.default)('MuiDigitalClock', [
    'root',
    'list',
    'item',
]);
