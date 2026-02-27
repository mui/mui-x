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
var getLabel_1 = require("../../internals/getLabel");
var tooltipGetter = function (params) {
    var _a;
    var series = params.series, getColor = params.getColor, identifier = params.identifier;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var point = series.data[identifier.dataIndex];
    if (point == null) {
        return null;
    }
    var label = (0, getLabel_1.getLabel)(point.label, 'tooltip');
    var value = __assign(__assign({}, point), { label: label });
    var formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });
    return {
        identifier: identifier,
        color: getColor(identifier.dataIndex),
        label: label,
        value: value,
        formattedValue: formattedValue,
        markType: (_a = point.labelMarkType) !== null && _a !== void 0 ? _a : series.labelMarkType,
    };
};
exports.default = tooltipGetter;
