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
]);
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        series: ['series'],
        seriesLabels: ['seriesLabels'],
    };
    return (0, composeClasses_1.default)(slots, getPieUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
