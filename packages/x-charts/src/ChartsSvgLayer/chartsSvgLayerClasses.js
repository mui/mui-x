"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartsSvgLayerClasses = exports.useUtilityClasses = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getSvgLayerUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsSvgLayer', slot);
}
var useUtilityClasses = function () {
    var slots = { root: ['root'] };
    return (0, composeClasses_1.default)(slots, getSvgLayerUtilityClass);
};
exports.useUtilityClasses = useUtilityClasses;
exports.chartsSvgLayerClasses = (0, generateUtilityClasses_1.default)('MuiChartsSvgLayer', ['root']);
