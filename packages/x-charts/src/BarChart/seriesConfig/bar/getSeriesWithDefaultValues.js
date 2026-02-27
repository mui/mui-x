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
exports.getSeriesWithDefaultValues = getSeriesWithDefaultValues;
function getSeriesWithDefaultValues(seriesData, seriesIndex, colors) {
    var _a, _b;
    return __assign(__assign({}, seriesData), { id: (_a = seriesData.id) !== null && _a !== void 0 ? _a : "auto-generated-id-".concat(seriesIndex), color: (_b = seriesData.color) !== null && _b !== void 0 ? _b : colors[seriesIndex % colors.length] });
}
