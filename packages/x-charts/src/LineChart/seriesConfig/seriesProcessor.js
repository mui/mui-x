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
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var warning_1 = require("@mui/x-internals/warning");
var stackSeries_1 = require("../../internals/stackSeries");
var defaultizeValueFormatter_1 = require("../../internals/defaultizeValueFormatter");
// For now it's a copy past of bar charts formatter, but maybe will diverge later
var seriesProcessor = function (params, dataset) {
    var _a;
    var seriesOrder = params.seriesOrder, series = params.series;
    var stackingGroups = (0, stackSeries_1.getStackingGroups)(__assign(__assign({}, params), { defaultStrategy: { stackOffset: 'none' } }));
    // Create a data set with format adapted to d3
    var d3Dataset = (_a = dataset) !== null && _a !== void 0 ? _a : [];
    seriesOrder.forEach(function (id) {
        var data = series[id].data;
        if (data !== undefined) {
            data.forEach(function (value, index) {
                var _a;
                if (d3Dataset.length <= index) {
                    d3Dataset.push((_a = {}, _a[id] = value, _a));
                }
                else {
                    d3Dataset[index][id] = value;
                }
            });
        }
        else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
            throw new Error([
                "MUI X Charts: line series with id='".concat(id, "' has no data."),
                'Either provide a data property to the series or use the dataset prop.',
            ].join('\n'));
        }
    });
    var completedSeries = {};
    stackingGroups.forEach(function (stackingGroup) {
        // Get stacked values, and derive the domain
        var ids = stackingGroup.ids, stackingOrder = stackingGroup.stackingOrder, stackingOffset = stackingGroup.stackingOffset;
        var stackedSeries = (0, d3_shape_1.stack)()
            .keys(ids.map(function (id) {
            // Use dataKey if needed and available
            var dataKey = series[id].dataKey;
            return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
        }))
            .value(function (d, key) { var _a; return (_a = d[key]) !== null && _a !== void 0 ? _a : 0; }) // defaultize null value to 0
            .order(stackingOrder)
            .offset(stackingOffset)(d3Dataset);
        ids.forEach(function (id, index) {
            var dataKey = series[id].dataKey;
            completedSeries[id] = __assign(__assign({ labelMarkType: 'line' }, series[id]), { data: dataKey
                    ? dataset.map(function (data) {
                        var value = data[dataKey];
                        if (typeof value !== 'number') {
                            if (process.env.NODE_ENV !== 'production') {
                                if (value !== null) {
                                    (0, warning_1.warnOnce)([
                                        "MUI X Charts: Your dataset key \"".concat(dataKey, "\" is used for plotting line, but contains nonnumerical elements."),
                                        'Line plots only support numbers and null values.',
                                    ]);
                                }
                            }
                            return null;
                        }
                        return value;
                    })
                    : series[id].data, stackedData: stackedSeries[index].map(function (_a) {
                    var a = _a[0], b = _a[1];
                    return [a, b];
                }) });
        });
    });
    return {
        seriesOrder: seriesOrder,
        stackingGroups: stackingGroups,
        series: (0, defaultizeValueFormatter_1.defaultizeValueFormatter)(completedSeries, function (v) { return (v == null ? '' : v.toLocaleString()); }),
    };
};
exports.default = seriesProcessor;
