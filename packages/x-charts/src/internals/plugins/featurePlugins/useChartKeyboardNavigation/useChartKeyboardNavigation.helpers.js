"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSeriesWithData = getNextSeriesWithData;
exports.getPreviousSeriesWithData = getPreviousSeriesWithData;
exports.seriesHasData = seriesHasData;
/**
 * Returns the next series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
function getNextSeriesWithData(series, type, seriesId) {
    var startingTypeIndex = type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
    var currentSeriesIndex = type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
        ? series[type].seriesOrder.indexOf(seriesId)
        : -1;
    var typesAvailable = Object.keys(series).filter(function (t) { return t !== 'sankey'; });
    // Loop over all series types starting with the current seriesType
    for (var typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
        var typeIndex_1 = (startingTypeIndex + typeGap) % typesAvailable.length;
        var seriesOfType_1 = series[typesAvailable[typeIndex_1]];
        // Edge case for the current series type: we don't loop on previous series of the same type.
        var startingSeriesIndex = typeGap === 0 ? currentSeriesIndex + 1 : 0;
        for (var seriesIndex = startingSeriesIndex; seriesIndex < seriesOfType_1.seriesOrder.length; seriesIndex += 1) {
            if (seriesOfType_1.series[seriesOfType_1.seriesOrder[seriesIndex]].data.length > 0) {
                return {
                    type: typesAvailable[typeIndex_1],
                    seriesId: seriesOfType_1.seriesOrder[seriesIndex],
                };
            }
        }
    }
    // End looping on the initial type up to the initial series (excluded)
    var typeIndex = startingTypeIndex;
    var seriesOfType = series[typesAvailable[typeIndex]];
    var endingSeriesIndex = currentSeriesIndex;
    for (var seriesIndex = 0; seriesIndex < endingSeriesIndex; seriesIndex += 1) {
        if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
            return {
                type: typesAvailable[typeIndex],
                seriesId: seriesOfType.seriesOrder[seriesIndex],
            };
        }
    }
    return null;
}
/**
 * Returns the previous series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
function getPreviousSeriesWithData(series, type, seriesId) {
    var startingTypeIndex = type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
    var startingSeriesIndex = type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
        ? series[type].seriesOrder.indexOf(seriesId)
        : 1;
    var typesAvailable = Object.keys(series).filter(function (t) { return t !== 'sankey'; });
    // Loop over all series types starting with the current seriesType
    for (var typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
        var typeIndex_2 = (typesAvailable.length + startingTypeIndex - typeGap) % typesAvailable.length;
        var seriesOfType_2 = series[typesAvailable[typeIndex_2]];
        var maxGap = typeGap === 0 ? startingSeriesIndex + 1 : seriesOfType_2.seriesOrder.length;
        for (var seriesGap = 1; seriesGap < maxGap; seriesGap += 1) {
            var seriesIndex = (seriesOfType_2.seriesOrder.length + startingSeriesIndex - seriesGap) %
                seriesOfType_2.seriesOrder.length;
            if (seriesOfType_2.series[seriesOfType_2.seriesOrder[seriesIndex]].data.length > 0) {
                return {
                    type: typesAvailable[typeIndex_2],
                    seriesId: seriesOfType_2.seriesOrder[seriesIndex],
                };
            }
        }
    }
    // End looping on the initial type down to the initial series (excluded)
    var typeIndex = startingTypeIndex;
    var seriesOfType = series[typesAvailable[typeIndex]];
    var availableSeriesIds = seriesOfType.seriesOrder;
    for (var seriesIndex = availableSeriesIds.length - 1; seriesIndex > startingSeriesIndex; seriesIndex -= 1) {
        if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
            return {
                type: typesAvailable[typeIndex],
                seriesId: seriesOfType.seriesOrder[seriesIndex],
            };
        }
    }
    return null;
}
function seriesHasData(series, type, seriesId) {
    var _a, _b;
    // @ts-ignore snakey is not in MIT version
    if (type === 'sankey') {
        return false;
    }
    var data = (_b = (_a = series[type]) === null || _a === void 0 ? void 0 : _a.series[seriesId]) === null || _b === void 0 ? void 0 : _b.data;
    return data && data.length > 0;
}
