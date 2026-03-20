"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var legendGetter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        var formattedLabel = (0, internals_1.getLabel)(series[seriesId].label, 'legend');
        if (formattedLabel === undefined) {
            return acc;
        }
        acc.push({
            type: 'ohlc',
            markType: series[seriesId].labelMarkType,
            seriesId: seriesId,
            color: series[seriesId].color,
            label: formattedLabel,
        });
        return acc;
    }, []);
};
exports.default = legendGetter;
