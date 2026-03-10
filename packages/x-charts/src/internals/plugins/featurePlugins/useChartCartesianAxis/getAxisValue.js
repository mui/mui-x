"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisIndex = getAxisIndex;
exports.getAxisValue = getAxisValue;
var scaleGuards_1 = require("../../../scaleGuards");
function getAsANumber(value) {
    return value instanceof Date ? value.getTime() : value;
}
/**
 * For a pointer coordinate, this function returns the dataIndex associated.
 * Returns `-1` if no dataIndex matches.
 */
function getAxisIndex(axisConfig, pointerValue) {
    var scale = axisConfig.scale, axisData = axisConfig.data, reverse = axisConfig.reverse;
    if (!(0, scaleGuards_1.isOrdinalScale)(scale)) {
        var value_1 = scale.invert(pointerValue);
        if (axisData === undefined) {
            return -1;
        }
        var valueAsNumber_1 = getAsANumber(value_1);
        var closestIndex = axisData === null || axisData === void 0 ? void 0 : axisData.findIndex(function (pointValue, index) {
            var v = getAsANumber(pointValue);
            if (v > valueAsNumber_1) {
                if (index === 0 ||
                    Math.abs(valueAsNumber_1 - v) <= Math.abs(valueAsNumber_1 - getAsANumber(axisData[index - 1]))) {
                    return true;
                }
            }
            if (v <= valueAsNumber_1) {
                if (index === axisData.length - 1 ||
                    Math.abs(getAsANumber(value_1) - v) <
                        Math.abs(getAsANumber(value_1) - getAsANumber(axisData[index + 1]))) {
                    return true;
                }
            }
            return false;
        });
        return closestIndex;
    }
    var dataIndex = scale.bandwidth() === 0
        ? Math.floor((pointerValue - Math.min.apply(Math, scale.range()) + scale.step() / 2) / scale.step())
        : Math.floor((pointerValue - Math.min.apply(Math, scale.range())) / scale.step());
    if (dataIndex < 0 || dataIndex >= axisData.length) {
        return -1;
    }
    return reverse ? axisData.length - 1 - dataIndex : dataIndex;
}
/**
 * For a pointer coordinate, this function returns the value associated.
 * Returns `null` if the coordinate has no value associated.
 */
function getAxisValue(scale, axisData, pointerValue, dataIndex) {
    if (!(0, scaleGuards_1.isOrdinalScale)(scale)) {
        if (dataIndex === null) {
            var invertedValue = scale.invert(pointerValue);
            return Number.isNaN(invertedValue) ? null : invertedValue;
        }
        return axisData[dataIndex];
    }
    if (dataIndex === null || dataIndex < 0 || dataIndex >= axisData.length) {
        return null;
    }
    return axisData[dataIndex];
}
