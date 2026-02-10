"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axisClasses = void 0;
exports.getAxisUtilityClass = getAxisUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getAxisUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsAxis', slot);
}
exports.axisClasses = (0, generateUtilityClasses_1.default)('MuiChartsAxis', [
    'root',
    'line',
    'tickContainer',
    'tick',
    'tickLabel',
    'label',
    'directionX',
    'directionY',
    'top',
    'bottom',
    'left',
    'right',
]);
