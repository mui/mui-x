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
var candlestickValueFormatter = function (v) {
    return v == null ? '' : "[".concat(v[0], ", ").concat(v[1], ", ").concat(v[2], ", ").concat(v[3], "]");
};
var seriesProcessor = function (params, _dataset, isItemVisible) {
    var _a;
    var seriesOrder = params.seriesOrder, series = params.series;
    var completedSeries = {};
    for (var _i = 0, seriesOrder_1 = seriesOrder; _i < seriesOrder_1.length; _i++) {
        var id = seriesOrder_1[_i];
        var seriesData = series[id];
        if (process.env.NODE_ENV !== 'production') {
            if (seriesData.data === undefined) {
                throw new Error("MUI X Charts: OHLC series with id='".concat(id, "' has no data. \n") +
                    'Provide a data property to the series.');
            }
        }
        completedSeries[id] = __assign(__assign({}, series[id]), { valueFormatter: (_a = series[id].valueFormatter) !== null && _a !== void 0 ? _a : candlestickValueFormatter, data: series[id].data, hidden: !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'ohlc', seriesId: id })) });
    }
    return {
        seriesOrder: seriesOrder,
        series: completedSeries,
    };
};
exports.default = seriesProcessor;
