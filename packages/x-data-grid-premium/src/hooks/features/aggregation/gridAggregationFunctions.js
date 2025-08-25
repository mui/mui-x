"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRID_AGGREGATION_FUNCTIONS = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var sumAgg = {
    apply: function (_a) {
        var values = _a.values;
        var sum = 0;
        for (var i = 0; i < values.length; i += 1) {
            var value = values[i];
            if (typeof value === 'number' && !Number.isNaN(value)) {
                sum += value;
            }
        }
        return sum;
    },
    columnTypes: ['number'],
};
var avgAgg = {
    apply: function (_a) {
        var values = _a.values;
        if (values.length === 0) {
            return null;
        }
        var sum = 0;
        var valuesCount = 0;
        for (var i = 0; i < values.length; i += 1) {
            var value = values[i];
            if (typeof value === 'number' && !Number.isNaN(value)) {
                valuesCount += 1;
                sum += value;
            }
        }
        if (sum === 0) {
            return null;
        }
        return sum / valuesCount;
    },
    columnTypes: ['number'],
};
var minAgg = {
    apply: function (_a) {
        var values = _a.values;
        if (values.length === 0) {
            return null;
        }
        var hasValidValue = false;
        var min = +Infinity;
        for (var i = 0; i < values.length; i += 1) {
            var value = values[i];
            if (value != null && value < min) {
                min = value;
                hasValidValue = true;
            }
        }
        if (!hasValidValue) {
            return null;
        }
        return min;
    },
    columnTypes: ['number', 'date', 'dateTime'],
};
var maxAgg = {
    apply: function (_a) {
        var values = _a.values;
        if (values.length === 0) {
            return null;
        }
        var hasValidValue = false;
        var max = -Infinity;
        for (var i = 0; i < values.length; i += 1) {
            var value = values[i];
            if (value != null && value > max) {
                max = value;
                hasValidValue = true;
            }
        }
        if (!hasValidValue) {
            return null;
        }
        return max;
    },
    columnTypes: ['number', 'date', 'dateTime'],
};
var sizeAgg = {
    apply: function (_a) {
        var values = _a.values;
        return values.filter(function (value) { return typeof value !== 'undefined'; }).length;
    },
    valueFormatter: function (value) {
        if (value == null || !(0, internals_1.isNumber)(value)) {
            return value;
        }
        return value.toLocaleString();
    },
    hasCellUnit: false,
};
exports.GRID_AGGREGATION_FUNCTIONS = {
    sum: sumAgg,
    avg: avgAgg,
    min: minAgg,
    max: maxAgg,
    size: sizeAgg,
};
