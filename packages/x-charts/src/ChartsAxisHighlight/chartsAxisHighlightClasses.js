"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartsAxisHighlightClasses = void 0;
exports.getAxisHighlightUtilityClass = getAxisHighlightUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getAxisHighlightUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsAxisHighlight', slot);
}
exports.chartsAxisHighlightClasses = (0, generateUtilityClasses_1.default)('MuiChartsAxisHighlight', ['root']);
