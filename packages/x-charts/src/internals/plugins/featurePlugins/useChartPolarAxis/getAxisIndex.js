"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisIndex = getAxisIndex;
var scaleGuards_1 = require("../../../scaleGuards");
var clampAngle_1 = require("../../../clampAngle");
/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
function getAxisIndex(axisConfig, pointerValue) {
    var scale = axisConfig.scale, axisData = axisConfig.data, reverse = axisConfig.reverse;
    if (!(0, scaleGuards_1.isOrdinalScale)(scale)) {
        throw new Error('MUI X Charts: getAxisValue is not implemented for polare continuous axes.');
    }
    if (!axisData) {
        return -1;
    }
    var angleGap = (0, clampAngle_1.clampAngleRad)(pointerValue - Math.min.apply(Math, scale.range()));
    var dataIndex = scale.bandwidth() === 0
        ? Math.floor((angleGap + scale.step() / 2) / scale.step()) % axisData.length
        : Math.floor(angleGap / scale.step());
    if (dataIndex < 0 || dataIndex >= axisData.length) {
        return -1;
    }
    return reverse ? axisData.length - 1 - dataIndex : dataIndex;
}
