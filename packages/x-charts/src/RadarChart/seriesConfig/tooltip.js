"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axisTooltipGetter = void 0;
var getLabel_1 = require("../../internals/getLabel");
var tooltipGetter = function (params) {
    var series = params.series, axesConfig = params.axesConfig, getColor = params.getColor, identifier = params.identifier;
    var rotationAxis = axesConfig.rotation;
    if (!identifier || !rotationAxis) {
        return null;
    }
    var label = (0, getLabel_1.getLabel)(series.label, 'tooltip');
    var formatter = function (v) {
        var _a, _b;
        return (_b = (_a = rotationAxis.valueFormatter) === null || _a === void 0 ? void 0 : _a.call(rotationAxis, v, {
            location: 'tooltip',
            scale: rotationAxis.scale,
        })) !== null && _b !== void 0 ? _b : (v == null ? '' : v.toLocaleString());
    };
    return {
        identifier: identifier,
        color: getColor(),
        label: label,
        markType: series.labelMarkType,
        values: series.data
            .filter(function (_, index) { return identifier.dataIndex == null || identifier.dataIndex === index; })
            .map(function (value, dataIndex) {
            var _a;
            return ({
                value: value,
                formattedValue: series.valueFormatter(value, { dataIndex: dataIndex }),
                markType: series.labelMarkType,
                label: formatter((_a = rotationAxis === null || rotationAxis === void 0 ? void 0 : rotationAxis.data) === null || _a === void 0 ? void 0 : _a[dataIndex]),
            });
        }),
    };
};
var axisTooltipGetter = function (series) {
    return Object.values(series).map(function () { return ({ direction: 'rotation', axisId: undefined }); });
};
exports.axisTooltipGetter = axisTooltipGetter;
exports.default = tooltipGetter;
