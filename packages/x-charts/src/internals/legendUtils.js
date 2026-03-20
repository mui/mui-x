"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesLegendItems = getSeriesLegendItems;
var getLabel_1 = require("./getLabel");
/** One legend item per series (bar, scatter, rangeBar, radar). */
function getSeriesLegendItems(type, params, defaultMarkType) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return seriesOrder.reduce(function (acc, seriesId) {
        var _a;
        var formattedLabel = (0, getLabel_1.getLabel)(series[seriesId].label, 'legend');
        if (formattedLabel === undefined) {
            return acc;
        }
        acc.push({
            type: type,
            markType: (_a = series[seriesId].labelMarkType) !== null && _a !== void 0 ? _a : defaultMarkType,
            seriesId: seriesId,
            color: series[seriesId].color,
            label: formattedLabel,
        });
        return acc;
    }, []);
}
