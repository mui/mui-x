"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.rangeBarClasses = void 0;
exports.getRangeBarUtilityClass = getRangeBarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRangeBarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRangeBar', slot);
}
exports.rangeBarClasses = (0, generateUtilityClasses_1.default)('MuiRangeBar', [
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
    return (0, composeClasses_1.default)(slots, getRangeBarUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
