"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.radarClasses = void 0;
exports.getRadarUtilityClass = getRadarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRadarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRadarChart', slot);
}
exports.radarClasses = (0, generateUtilityClasses_1.default)('MuiRadarChart', [
    'axisRoot',
    'axisLine',
    'axisLabel',
    'gridRadial',
    'gridDivider',
    'gridStripe',
    'seriesRoot',
    'seriesArea',
    'seriesMark',
    'axisHighlightRoot',
    'axisHighlightLine',
    'axisHighlightDot',
]);
var useUtilityClasses = function (classes) {
    var slots = {
        axisRoot: ['axisRoot'],
        axisLine: ['axisLine'],
        axisLabel: ['axisLabel'],
        gridRadial: ['gridRadial'],
        gridDivider: ['gridDivider'],
        gridStripe: ['gridStripe'],
        seriesRoot: ['seriesRoot'],
        seriesArea: ['seriesArea'],
        seriesMark: ['seriesMark'],
        axisHighlightRoot: ['axisHighlightRoot'],
        axisHighlightLine: ['axisHighlightLine'],
        axisHighlightDot: ['axisHighlightDot'],
    };
    return (0, composeClasses_1.default)(slots, getRadarUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
