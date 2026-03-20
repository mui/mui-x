"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var tooltipGetter = function (params) {
    var series = params.series, getColor = params.getColor, identifier = params.identifier;
    if (!identifier) {
        return null;
    }
    var cellValue = series.heatmapData.getValue(identifier.xIndex, identifier.yIndex);
    var label = (0, internals_1.getLabel)(series.label, 'tooltip');
    var formattedValue = series.valueFormatter(cellValue, {
        xIndex: identifier.xIndex,
        yIndex: identifier.yIndex,
    });
    return {
        identifier: identifier,
        color: getColor(cellValue),
        label: label,
        value: cellValue,
        formattedValue: formattedValue,
        markType: series.labelMarkType,
    };
};
exports.default = tooltipGetter;
