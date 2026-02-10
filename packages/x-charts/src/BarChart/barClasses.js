"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.barClasses = void 0;
exports.getBarUtilityClass = getBarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getBarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiBarChart', slot);
}
exports.barClasses = (0, generateUtilityClasses_1.default)('MuiBarChart', [
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
    return (0, composeClasses_1.default)(slots, getBarUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
