"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateData = void 0;
exports.createDateFormatter = createDateFormatter;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
/**
 * Checks if the provided data array contains Date objects.
 * @param data The data array to check.
 * @returns A type predicate indicating if the data is an array of Date objects.
 */
var isDateData = function (data) { return (data === null || data === void 0 ? void 0 : data[0]) instanceof Date; };
exports.isDateData = isDateData;
/**
 * Creates a formatter function for date values.
 * @param axis The axis configuration.
 * @param range The range for the time scale.
 * @returns A formatter function for date values.
 */
function createDateFormatter(axis, range) {
    var timeScale = (0, d3_scale_1.scaleTime)(axis.data, range);
    return function (v, _a) {
        var location = _a.location;
        return location === 'tick' ? timeScale.tickFormat(axis.tickNumber)(v) : "".concat(v.toLocaleString());
    };
}
