"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var tooltipGetter = function (params) {
    var series = params.series, getColor = params.getColor, identifier = params.identifier;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var label = (0, internals_1.getLabel)(series.label, 'tooltip');
    var value = series.data[identifier.dataIndex];
    var formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });
    return {
        identifier: identifier,
        color: getColor(identifier.dataIndex),
        label: label,
        value: value,
        formattedValue: formattedValue,
        markType: series.labelMarkType,
    };
};
exports.default = tooltipGetter;
