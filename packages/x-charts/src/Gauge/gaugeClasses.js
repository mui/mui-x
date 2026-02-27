"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gaugeClasses = void 0;
exports.getGaugeUtilityClass = getGaugeUtilityClass;
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
function getGaugeUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiGauge', slot);
}
exports.gaugeClasses = (0, generateUtilityClasses_1.default)('MuiGauge', [
    'root',
    'valueArc',
    'referenceArc',
    'valueText',
]);
