"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.pieClasses = void 0;
exports.getPieUtilityClass = getPieUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPieUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPieChart', slot);
}
exports.pieClasses = (0, generateUtilityClasses_1.default)('MuiPieChart', [
    'root',
    'series',
    'seriesLabels',
    'arc',
    'arcLabel',
    'animate',
    'focusIndicator',
]);
var useUtilityClasses = function (options) {
    var _a = options !== null && options !== void 0 ? options : {}, classes = _a.classes, skipAnimation = _a.skipAnimation;
    var slots = {
        root: ['root'],
        series: ['series'],
        seriesLabels: ['seriesLabels'],
        arc: ['arc'],
        arcLabel: ['arcLabel', !skipAnimation && 'animate'],
        focusIndicator: ['focusIndicator'],
    };
    return (0, composeClasses_1.default)(slots, getPieUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
