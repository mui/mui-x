"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonEmptySeriesArray = getNonEmptySeriesArray;
function getNonEmptySeriesArray(series, availableSeriesTypes) {
    return Object.keys(series)
        .filter(function (type) { return availableSeriesTypes.has(type); })
        .flatMap(function (type) {
        var seriesOfType = series[type];
        return seriesOfType.seriesOrder
            .filter(function (seriesId) {
            return seriesOfType.series[seriesId].data.length > 0 &&
                seriesOfType.series[seriesId].data.some(function (value) { return value != null; });
        })
            .map(function (seriesId) { return ({
            type: type,
            seriesId: seriesId,
        }); });
    });
}
