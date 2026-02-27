"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartsGridClasses = void 0;
exports.getChartsGridUtilityClass = getChartsGridUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getChartsGridUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsGrid', slot);
}
exports.chartsGridClasses = (0, generateUtilityClasses_1.default)('MuiChartsGrid', [
    'root',
    'line',
    'horizontalLine',
    'verticalLine',
]);
