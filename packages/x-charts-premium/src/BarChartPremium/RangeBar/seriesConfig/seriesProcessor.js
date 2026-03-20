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
var warning_1 = require("@mui/x-internals/warning");
var rangeBarValueFormatter = function (v) {
    return v == null ? '' : "[".concat(v[0], ", ").concat(v[1], "]");
};
var seriesProcessor = function (params, dataset, isItemVisible) {
    var _a;
    var seriesOrder = params.seriesOrder, series = params.series;
    var completedSeries = {};
    var _loop_1 = function (id) {
        var seriesData = series[id];
        var datasetKeys = seriesData === null || seriesData === void 0 ? void 0 : seriesData.datasetKeys;
        if (seriesData.data === undefined &&
            dataset === undefined &&
            process.env.NODE_ENV !== 'production') {
            throw new Error("MUI X Charts: range bar series with id='".concat(id, "' has no data.\nEither provide a data property to the series or use the dataset prop."));
        }
        var missingKeys = ['start', 'end'].filter(function (key) { return typeof (datasetKeys === null || datasetKeys === void 0 ? void 0 : datasetKeys[key]) !== 'string'; });
        if (datasetKeys && missingKeys.length > 0) {
            throw new Error("MUI X Charts: range bar series with id='".concat(id, "' has incomplete datasetKeys.\nProperties ").concat(missingKeys.map(function (key) { return "\"".concat(key, "\""); }).join(', '), " are missing."));
        }
        completedSeries[id] = __assign(__assign({ layout: 'vertical' }, series[id]), { valueFormatter: (_a = series[id].valueFormatter) !== null && _a !== void 0 ? _a : rangeBarValueFormatter, data: datasetKeys
                ? dataset.map(function (data) {
                    var start = data[datasetKeys.start];
                    var end = data[datasetKeys.end];
                    if (typeof start !== 'number' || typeof end !== 'number') {
                        if (process.env.NODE_ENV !== 'production') {
                            if (start !== null) {
                                (0, warning_1.warnOnce)([
                                    "MUI X Charts: Your dataset key \"start\" is used for plotting an range bar, but contains nonnumerical elements.",
                                    'Range bars only support numbers.',
                                ]);
                            }
                            if (end !== null) {
                                (0, warning_1.warnOnce)([
                                    "MUI X Charts: Your dataset key \"end\" is used for plotting an range bar, but contains nonnumerical elements.",
                                    'Range bars only support numbers.',
                                ]);
                            }
                        }
                        return null;
                    }
                    return [start, end];
                })
                : series[id].data, hidden: !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'rangeBar', seriesId: id })) });
    };
    for (var _i = 0, seriesOrder_1 = seriesOrder; _i < seriesOrder_1.length; _i++) {
        var id = seriesOrder_1[_i];
        _loop_1(id);
    }
    return {
        seriesOrder: seriesOrder,
        series: completedSeries,
    };
};
exports.default = seriesProcessor;
