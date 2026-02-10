"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceLineClasses = void 0;
exports.getReferenceLineUtilityClass = getReferenceLineUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getReferenceLineUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsReferenceLine', slot);
}
exports.referenceLineClasses = (0, generateUtilityClasses_1.default)('MuiChartsReferenceLine', ['root', 'vertical', 'horizontal', 'line', 'label']);
