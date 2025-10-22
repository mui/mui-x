"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessSeries = void 0;
/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
var preprocessSeries = function (_a) {
    var series = _a.series, colors = _a.colors, seriesConfig = _a.seriesConfig, dataset = _a.dataset;
    // Group series by type
    var seriesGroups = {};
    // Notice the line about uses `ChartSeriesType` instead of TSeriesType.
    // That's probably because the series.type is not propagated from the generic but hardcoded in the config.
    series.forEach(function (seriesData, seriesIndex) {
        var _a;
        var seriesWithDefaultValues = seriesConfig[seriesData.type].getSeriesWithDefaultValues(seriesData, seriesIndex, colors);
        var id = seriesWithDefaultValues.id;
        if (seriesGroups[seriesData.type] === undefined) {
            seriesGroups[seriesData.type] = { series: {}, seriesOrder: [] };
        }
        if (((_a = seriesGroups[seriesData.type]) === null || _a === void 0 ? void 0 : _a.series[id]) !== undefined) {
            throw new Error("MUI X Charts: series' id \"".concat(id, "\" is not unique."));
        }
        seriesGroups[seriesData.type].series[id] = seriesWithDefaultValues;
        seriesGroups[seriesData.type].seriesOrder.push(id);
    });
    var processedSeries = {};
    // Apply formatter on a type group
    Object.keys(seriesConfig).forEach(function (type) {
        var _a, _b, _c;
        var group = seriesGroups[type];
        if (group !== undefined) {
            processedSeries[type] =
                (_c = (_b = (_a = seriesConfig[type]) === null || _a === void 0 ? void 0 : _a.seriesProcessor) === null || _b === void 0 ? void 0 : _b.call(_a, group, dataset)) !== null && _c !== void 0 ? _c : seriesGroups[type];
        }
    });
    return processedSeries;
};
exports.preprocessSeries = preprocessSeries;
