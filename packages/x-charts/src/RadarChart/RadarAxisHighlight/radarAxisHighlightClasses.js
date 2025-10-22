"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartsAxisHighlightClasses = void 0;
exports.getRadarAxisHighlightUtilityClass = getRadarAxisHighlightUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRadarAxisHighlightUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRadarAxisHighlight', slot);
}
exports.chartsAxisHighlightClasses = (0, generateUtilityClasses_1.default)('MuiRadarAxisHighlight', ['root', 'line', 'dot']);
