"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScaleErrors = checkScaleErrors;
var warning_1 = require("@mui/x-internals/warning");
var constants_1 = require("../constants");
var axis_1 = require("../models/axis");
var getAxisMessage = function (axisDirection, axisId) {
    var axisName = "".concat(axisDirection, "-axis");
    var axisIdName = "".concat(axisDirection, "Axis");
    var axisDefaultKey = axisDirection === 'x' ? constants_1.DEFAULT_X_AXIS_KEY : constants_1.DEFAULT_Y_AXIS_KEY;
    return axisId === axisDefaultKey
        ? "The first `".concat(axisIdName, "`")
        : "The ".concat(axisName, " with id \"").concat(axisId, "\"");
};
function checkScaleErrors(verticalLayout, seriesId, series, xAxisId, xAxis, yAxisId, yAxis) {
    var xAxisConfig = xAxis[xAxisId];
    var yAxisConfig = yAxis[yAxisId];
    var discreteAxisConfig = verticalLayout ? xAxisConfig : yAxisConfig;
    var continuousAxisConfig = verticalLayout ? yAxisConfig : xAxisConfig;
    var discreteAxisId = verticalLayout ? xAxisId : yAxisId;
    var continuousAxisId = verticalLayout ? yAxisId : xAxisId;
    var discreteAxisDirection = verticalLayout ? 'x' : 'y';
    var continuousAxisDirection = verticalLayout ? 'y' : 'x';
    if (!(0, axis_1.isBandScaleConfig)(discreteAxisConfig)) {
        throw new Error("MUI X Charts: ".concat(getAxisMessage(discreteAxisDirection, discreteAxisId), " should be of type \"band\" to display the bar series of id \"").concat(seriesId, "\"."));
    }
    if (discreteAxisConfig.data === undefined) {
        throw new Error("MUI X Charts: ".concat(getAxisMessage(discreteAxisDirection, discreteAxisId), " should have data property."));
    }
    if ((0, axis_1.isBandScaleConfig)(continuousAxisConfig) || (0, axis_1.isPointScaleConfig)(continuousAxisConfig)) {
        throw new Error("MUI X Charts: ".concat(getAxisMessage(continuousAxisDirection, continuousAxisId), " should be a continuous type to display the bar series of id \"").concat(seriesId, "\"."));
    }
    if (process.env.NODE_ENV !== 'production') {
        if (discreteAxisConfig.data.length < series.stackedData.length) {
            (0, warning_1.warnOnce)([
                "MUI X Charts: ".concat(getAxisMessage(discreteAxisDirection, discreteAxisId), " has less data (").concat(discreteAxisConfig.data.length, " values) than the bar series of id \"").concat(seriesId, "\" (").concat(series.stackedData.length, " values)."),
                'The axis data should have at least the same length than the series using it.',
            ], 'error');
        }
    }
}
