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
var seriesProcessor = function (params) {
    var series = params.series, seriesOrder = params.seriesOrder;
    var defaultizedSeries = {};
    Object.keys(series).forEach(function (seriesId) {
        defaultizedSeries[seriesId] = __assign({ 
            // Defaultize the data and the value formatter.
            valueFormatter: function (v) { return v[2].toString(); }, data: [], labelMarkType: 'square' }, series[seriesId]);
    });
    return {
        series: defaultizedSeries,
        seriesOrder: seriesOrder,
    };
};
exports.default = seriesProcessor;
