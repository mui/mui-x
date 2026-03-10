"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axisTooltipGetter = void 0;
var getLabel_1 = require("../../../internals/getLabel");
var tooltipGetter = function (params) {
    var series = params.series, getColor = params.getColor, identifier = params.identifier;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var label = (0, getLabel_1.getLabel)(series.label, 'tooltip');
    var value = series.data[identifier.dataIndex];
    if (value == null) {
        return null;
    }
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
var axisTooltipGetter = function (series) {
    return Object.values(series).map(function (s) {
        return s.layout === 'horizontal'
            ? { direction: 'y', axisId: s.yAxisId }
            : { direction: 'x', axisId: s.xAxisId };
    });
};
exports.axisTooltipGetter = axisTooltipGetter;
exports.default = tooltipGetter;
