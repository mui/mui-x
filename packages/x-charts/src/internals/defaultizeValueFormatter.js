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
exports.defaultizeValueFormatter = defaultizeValueFormatter;
function defaultizeValueFormatter(series, defaultValueFormatter) {
    var defaultizedSeries = {};
    Object.keys(series).forEach(function (seriesId) {
        var _a;
        defaultizedSeries[seriesId] = __assign(__assign({}, series[seriesId]), { valueFormatter: (_a = series[seriesId].valueFormatter) !== null && _a !== void 0 ? _a : defaultValueFormatter });
    });
    return defaultizedSeries;
}
