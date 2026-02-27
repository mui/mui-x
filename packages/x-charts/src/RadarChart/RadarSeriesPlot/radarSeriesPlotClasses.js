"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.radarSeriesPlotClasses = void 0;
exports.getRadarSeriesPlotUtilityClass = getRadarSeriesPlotUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRadarSeriesPlotUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRadarSeriesPlot', slot);
}
exports.radarSeriesPlotClasses = (0, generateUtilityClasses_1.default)('MuiRadarSeriesPlot', [
    'root',
    'area',
    'mark',
    'highlighted',
    'faded',
]);
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        area: ['area'],
        mark: ['mark'],
        highlighted: ['highlighted'],
        faded: ['faded'],
    };
    return (0, composeClasses_1.default)(slots, getRadarSeriesPlotUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
