"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySeriesLayout = exports.applySeriesProcessors = exports.defaultizeSeries = void 0;
/**
 * This method groups series by type and adds defaultized values such as the ids and colors.
 * It does NOT apply the series processors - that happens in a selector.
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type with default values.
 */
var defaultizeSeries = function (_a) {
    var series = _a.series, colors = _a.colors, seriesConfig = _a.seriesConfig;
    // Group series by type
    var seriesGroups = {};
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
    return seriesGroups;
};
exports.defaultizeSeries = defaultizeSeries;
/**
 * Applies series processors to the defaultized series groups.
 * This should be called in a selector to compute processed series on-demand.
 * @param defaultizedSeries The defaultized series groups
 * @param seriesConfig The series configuration
 * @param dataset The optional dataset
 * @returns Processed series with all transformations applied
 */
var applySeriesProcessors = function (defaultizedSeries, seriesConfig, dataset, isItemVisible) {
    var processedSeries = {};
    // Apply formatter on a type group
    Object.keys(seriesConfig).forEach(function (type) {
        var _a, _b, _c;
        var group = defaultizedSeries[type];
        if (group !== undefined) {
            processedSeries[type] =
                (_c = (_b = (_a = seriesConfig[type]) === null || _a === void 0 ? void 0 : _a.seriesProcessor) === null || _b === void 0 ? void 0 : _b.call(_a, group, dataset, isItemVisible)) !== null && _c !== void 0 ? _c : group;
        }
    });
    return processedSeries;
};
exports.applySeriesProcessors = applySeriesProcessors;
/**
 * Applies series processors with drawing area to series if defined.
 * @param processedSeries The processed series groups
 * @param seriesConfig The series configuration
 * @param drawingArea The drawing area
 * @returns Processed series with all transformations applied
 */
var applySeriesLayout = function (processedSeries, seriesConfig, drawingArea) {
    var processingDetected = false;
    var seriesLayout = {};
    // Apply processors on series type per group
    Object.keys(processedSeries).forEach(function (type) {
        var _a;
        var processor = (_a = seriesConfig[type]) === null || _a === void 0 ? void 0 : _a.seriesLayout;
        var thisSeries = processedSeries[type];
        if (processor !== undefined && thisSeries !== undefined) {
            var newValue = processor(thisSeries, drawingArea);
            if (newValue && newValue !== processedSeries[type]) {
                processingDetected = true;
                seriesLayout[type] = newValue;
            }
        }
    });
    if (!processingDetected) {
        return {};
    }
    return seriesLayout;
};
exports.applySeriesLayout = applySeriesLayout;
