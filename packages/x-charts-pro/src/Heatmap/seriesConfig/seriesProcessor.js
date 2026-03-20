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
var heatmap_1 = require("../../models/seriesType/heatmap");
var seriesProcessor = function (params) {
    var series = params.series, seriesOrder = params.seriesOrder;
    var defaultizedSeries = {};
    Object.keys(series).forEach(function (seriesId) {
        var _a;
        var data = (_a = series[seriesId].data) !== null && _a !== void 0 ? _a : [];
        var heatmapData = new heatmap_1.HeatmapData(data);
        defaultizedSeries[seriesId] = __assign(__assign({ 
            // Defaultize the data and the value formatter.
            valueFormatter: function (v) { var _a; return (_a = v === null || v === void 0 ? void 0 : v.toString()) !== null && _a !== void 0 ? _a : null; }, data: data, labelMarkType: 'square' }, series[seriesId]), { heatmapData: heatmapData });
    });
    return {
        series: defaultizedSeries,
        seriesOrder: seriesOrder,
    };
};
exports.default = seriesProcessor;
