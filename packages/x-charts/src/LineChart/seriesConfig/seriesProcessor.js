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
var stacking_1 = require("../../internals/stacking");
var lineValueFormatter = (function (v) {
    return v == null ? '' : v.toLocaleString();
});
var seriesProcessor = function (params, dataset, isItemVisible) {
    var _a;
    var seriesOrder = params.seriesOrder, series = params.series;
    var stackingGroups = (0, stacking_1.getStackingGroups)(__assign(__assign({}, params), { defaultStrategy: { stackOffset: 'none' } }));
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
        if (process.env.NODE_ENV !== 'production') {
            if (!data && dataset) {
                var dataKey_1 = series[id].dataKey;
                if (!dataKey_1) {
                    throw new Error([
                        "MUI X Charts: line series with id='".concat(id, "' has no data and no dataKey."),
                        'You must provide a dataKey when using the dataset prop.',
                    ].join('\n'));
                }
                dataset.forEach(function (entry, index) {
                    var value = entry[dataKey_1];
                    if (value != null && typeof value !== 'number') {
                        (0, warning_1.warnOnce)([
                            "MUI X Charts: your dataset key \"".concat(dataKey_1, "\" is used for plotting lines, but the dataset contains the non-null non-numerical element \"").concat(value, "\" at index ").concat(index, "."),
                            'Line plots only support numeric and null values.',
                        ].join('\n'));
                    }
                });
            }
        }
    });
    var completedSeries = {};
    stackingGroups.forEach(function (stackingGroup) {
        var ids = stackingGroup.ids, stackingOffset = stackingGroup.stackingOffset, stackingOrder = stackingGroup.stackingOrder;
        var keys = ids.map(function (id) {
            // Use dataKey if needed and available
            var dataKey = series[id].dataKey;
            return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
        });
        var stackedData = (0, d3_shape_1.stack)()
            .keys(keys)
            .value(function (d, key) { var _a; return (_a = d[key]) !== null && _a !== void 0 ? _a : 0; }) // defaultize null value to 0
            .order(stackingOrder)
            .offset(stackingOffset)(d3Dataset);
        var idOrder = stackedData.map(function (s) { return s.index; });
        var fixedOrder = function () { return idOrder; };
        // Compute visible stacked data
        var visibleStackedData = (0, d3_shape_1.stack)()
            .keys(keys)
            .value(function (d, key) {
            var _a;
            var keyIndex = keys.indexOf(key);
            var seriesId = ids[keyIndex];
            if (!(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'line', seriesId: seriesId }))) {
                // For hidden series, return 0 so they don't contribute to the stack
                return 0;
            }
            return (_a = d[key]) !== null && _a !== void 0 ? _a : 0;
        })
            .order(fixedOrder)
            .offset(stackingOffset)(d3Dataset);
        ids.forEach(function (id, index) {
            var _a;
            var dataKey = series[id].dataKey;
            var data = dataKey
                ? dataset.map(function (d) {
                    var value = d[dataKey];
                    return typeof value === 'number' ? value : null;
                })
                : series[id].data;
            var hidden = !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'line', seriesId: id }));
            completedSeries[id] = __assign(__assign({ labelMarkType: 'line' }, series[id]), { data: data, valueFormatter: (_a = series[id].valueFormatter) !== null && _a !== void 0 ? _a : lineValueFormatter, hidden: hidden, stackedData: stackedData[index], visibleStackedData: visibleStackedData[index] });
        });
    });
    return {
        seriesOrder: seriesOrder,
        stackingGroups: stackingGroups,
        series: completedSeries,
    };
};
exports.default = seriesProcessor;
