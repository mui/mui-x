"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.lineClasses = void 0;
exports.getLineUtilityClass = getLineUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getLineUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiLineChart', slot);
}
exports.lineClasses = (0, generateUtilityClasses_1.default)('MuiLineChart', [
    'area',
    'line',
    'mark',
    'markAnimate',
    'highlight',
    'areaPlot',
    'linePlot',
    'markPlot',
]);
var useUtilityClasses = function (options) {
    var _a = options !== null && options !== void 0 ? options : {}, skipAnimation = _a.skipAnimation, classes = _a.classes;
    var slots = {
        area: ['area'],
        line: ['line'],
        mark: ['mark', !skipAnimation && 'markAnimate'],
        highlight: ['highlight'],
        areaPlot: ['areaPlot'],
        linePlot: ['linePlot'],
        markPlot: ['markPlot'],
    };
    return (0, composeClasses_1.default)(slots, getLineUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
