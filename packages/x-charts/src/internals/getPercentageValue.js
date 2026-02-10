"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPercentageValue = getPercentageValue;
/**
 * Helper that converts values and percentages into values.
 * @param value The value provided by the developer. Can either be a number or a string with '%' or 'px'.
 * @param refValue The numerical value associated to 100%.
 * @returns The numerical value associated to the provided value.
 */
function getPercentageValue(value, refValue) {
    if (typeof value === 'number') {
        return value;
    }
    if (value === '100%') {
        // Avoid potential rounding issues
        return refValue;
    }
    if (value.endsWith('%')) {
        var percentage = Number.parseFloat(value.slice(0, value.length - 1));
        if (!Number.isNaN(percentage)) {
            return (percentage * refValue) / 100;
        }
    }
    if (value.endsWith('px')) {
        var val = Number.parseFloat(value.slice(0, value.length - 2));
        if (!Number.isNaN(val)) {
            return val;
        }
    }
    throw new Error("MUI X Charts: Received an unknown value \"".concat(value, "\". It should be a number, or a string with a percentage value."));
}
