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
var defaultRadarValueFormatter = function (v) {
    return v == null ? '' : v.toLocaleString();
};
var seriesProcessor = function (params, _, isItemVisible) {
    var seriesOrder = params.seriesOrder, seriesMap = params.series;
    var completedSeries = {};
    seriesOrder.forEach(function (seriesId) {
        var _a;
        var series = seriesMap[seriesId];
        var hidden = !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'radar', seriesId: seriesId }));
        completedSeries[seriesId] = __assign(__assign({ labelMarkType: 'square' }, series), { valueFormatter: (_a = series.valueFormatter) !== null && _a !== void 0 ? _a : defaultRadarValueFormatter, hidden: hidden });
    });
    return {
        seriesOrder: seriesOrder,
        series: completedSeries,
    };
};
exports.default = seriesProcessor;
