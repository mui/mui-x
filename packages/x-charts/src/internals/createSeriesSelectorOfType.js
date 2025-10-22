"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeriesSelectorsOfType = createSeriesSelectorsOfType;
exports.createAllSeriesSelectorOfType = createAllSeriesSelectorOfType;
var fastArrayCompare_1 = require("@mui/x-internals/fastArrayCompare");
var warning_1 = require("@mui/x-internals/warning");
var selectors_1 = require("./plugins/utils/selectors");
var useChartSeries_selectors_1 = require("./plugins/corePlugins/useChartSeries/useChartSeries.selectors");
var useStore_1 = require("./store/useStore");
var useSelector_1 = require("./store/useSelector");
function createSeriesSelectorsOfType(seriesType) {
    var selectorSeriesWithIds = (0, selectors_1.createSelector)([useChartSeries_selectors_1.selectorChartSeriesProcessed, function (_, ids) { return ids; }], function (processedSeries, ids) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!ids || (Array.isArray(ids) && ids.length === 0)) {
            return ((_c = (_b = (_a = processedSeries[seriesType]) === null || _a === void 0 ? void 0 : _a.seriesOrder) === null || _b === void 0 ? void 0 : _b.map(function (seriesId) { var _a; return (_a = processedSeries[seriesType]) === null || _a === void 0 ? void 0 : _a.series[seriesId]; })) !== null && _c !== void 0 ? _c : []);
        }
        if (!Array.isArray(ids)) {
            return (_e = (_d = processedSeries[seriesType]) === null || _d === void 0 ? void 0 : _d.series) === null || _e === void 0 ? void 0 : _e[ids];
        }
        var result = [];
        var failedIds = [];
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            var series = (_g = (_f = processedSeries[seriesType]) === null || _f === void 0 ? void 0 : _f.series) === null || _g === void 0 ? void 0 : _g[id];
            if (series) {
                result.push(series);
            }
            else {
                failedIds.push(id);
            }
        }
        if (process.env.NODE_ENV !== 'production' && failedIds.length > 0) {
            var formattedIds = failedIds.map(function (v) { return JSON.stringify(v); }).join(', ');
            var fnName = "use".concat(seriesType.charAt(0).toUpperCase()).concat(seriesType.slice(1), "Series");
            (0, warning_1.warnOnce)([
                "MUI X Charts: The following ids provided to \"".concat(fnName, "\" could not be found: ").concat(formattedIds, "."),
                "Make sure that they exist and their series are using the \"".concat(seriesType, "\" series type."),
            ]);
        }
        return result;
    });
    return function (ids) {
        var store = (0, useStore_1.useStore)();
        return (0, useSelector_1.useSelector)(store, selectorSeriesWithIds, [ids], fastArrayCompare_1.fastArrayCompare);
    };
}
function createAllSeriesSelectorOfType(seriesType) {
    var selectorSeries = (0, selectors_1.createSelector)([useChartSeries_selectors_1.selectorChartSeriesProcessed], function (processedSeries) { return processedSeries[seriesType]; });
    return function () {
        var store = (0, useStore_1.useStore)();
        return (0, useSelector_1.useSelector)(store, selectorSeries);
    };
}
