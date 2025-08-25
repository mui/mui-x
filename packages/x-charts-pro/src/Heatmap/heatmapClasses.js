"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heatmapClasses = void 0;
exports.getHeatmapUtilityClass = getHeatmapUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getHeatmapUtilityClass(slot) {
    // Those should be common to all charts
    if (['highlighted', 'faded'].includes(slot)) {
        return (0, generateUtilityClass_1.default)('Charts', slot);
    }
    return (0, generateUtilityClass_1.default)('MuiHeatmap', slot);
}
exports.heatmapClasses = __assign(__assign({}, (0, generateUtilityClasses_1.default)('MuiHeatmap', ['cell', 'series'])), { highlighted: 'Charts-highlighted', faded: 'Charts-faded' });
