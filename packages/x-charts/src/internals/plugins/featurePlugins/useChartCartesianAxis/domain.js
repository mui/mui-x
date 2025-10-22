"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateInitialDomainAndTickNumber = calculateInitialDomainAndTickNumber;
exports.calculateFinalDomain = calculateFinalDomain;
var getScale_1 = require("../../../getScale");
var getAxisDomainLimit_1 = require("./getAxisDomainLimit");
var ticks_1 = require("../../../ticks");
function niceDomain(scaleType, domain, tickNumber) {
    return (0, getScale_1.getScale)(scaleType !== null && scaleType !== void 0 ? scaleType : 'linear', domain, [0, 1])
        .nice(tickNumber)
        .domain();
}
/**
 * Calculates the initial domain and tick number for a given axis.
 * The domain should still run through the zoom filterMode after this step.
 */
function calculateInitialDomainAndTickNumber(axis, axisDirection, axisIndex, formattedSeries, _a, defaultTickNumber, preferStrictDomainInLineCharts) {
    var _b, _c;
    var minData = _a[0], maxData = _a[1];
    var domainLimit = getDomainLimit(axis, axisDirection, axisIndex, formattedSeries, preferStrictDomainInLineCharts);
    var axisExtrema = getActualAxisExtrema(axis, minData, maxData);
    if (typeof domainLimit === 'function') {
        var _d = domainLimit(minData.valueOf(), maxData.valueOf()), min = _d.min, max = _d.max;
        axisExtrema[0] = min;
        axisExtrema[1] = max;
    }
    var tickNumber = (0, ticks_1.getTickNumber)(axis, axisExtrema, defaultTickNumber);
    if (domainLimit === 'nice') {
        axisExtrema = niceDomain(axis.scaleType, axisExtrema, tickNumber);
    }
    axisExtrema = [
        'min' in axis ? ((_b = axis.min) !== null && _b !== void 0 ? _b : axisExtrema[0]) : axisExtrema[0],
        'max' in axis ? ((_c = axis.max) !== null && _c !== void 0 ? _c : axisExtrema[1]) : axisExtrema[1],
    ];
    return { domain: axisExtrema, tickNumber: tickNumber };
}
/**
 * Calculates the final domain for an axis.
 * After this step, the domain can be used to create the axis scale.
 */
function calculateFinalDomain(axis, axisDirection, axisIndex, formattedSeries, _a, tickNumber, preferStrictDomainInLineCharts) {
    var _b, _c;
    var minData = _a[0], maxData = _a[1];
    var domainLimit = getDomainLimit(axis, axisDirection, axisIndex, formattedSeries, preferStrictDomainInLineCharts);
    var axisExtrema = getActualAxisExtrema(axis, minData, maxData);
    if (typeof domainLimit === 'function') {
        var _d = domainLimit(minData.valueOf(), maxData.valueOf()), min = _d.min, max = _d.max;
        axisExtrema[0] = min;
        axisExtrema[1] = max;
    }
    if (domainLimit === 'nice') {
        axisExtrema = niceDomain(axis.scaleType, axisExtrema, tickNumber);
    }
    return [(_b = axis.min) !== null && _b !== void 0 ? _b : axisExtrema[0], (_c = axis.max) !== null && _c !== void 0 ? _c : axisExtrema[1]];
}
function getDomainLimit(axis, axisDirection, axisIndex, formattedSeries, preferStrictDomainInLineCharts) {
    var _a;
    return preferStrictDomainInLineCharts
        ? (0, getAxisDomainLimit_1.getAxisDomainLimit)(axis, axisDirection, axisIndex, formattedSeries)
        : ((_a = axis.domainLimit) !== null && _a !== void 0 ? _a : 'nice');
}
/**
 * Get the actual axis extrema considering the user defined min and max values.
 * @param axisExtrema User defined axis extrema.
 * @param minData Minimum value from the data.
 * @param maxData Maximum value from the data.
 */
function getActualAxisExtrema(axisExtrema, minData, maxData) {
    var _a, _b;
    var min = minData;
    var max = maxData;
    if ('max' in axisExtrema && axisExtrema.max != null && axisExtrema.max < minData) {
        min = axisExtrema.max;
    }
    if ('min' in axisExtrema && axisExtrema.min != null && axisExtrema.min > minData) {
        max = axisExtrema.min;
    }
    if (!('min' in axisExtrema) && !('max' in axisExtrema)) {
        return [min, max];
    }
    return [(_a = axisExtrema.min) !== null && _a !== void 0 ? _a : min, (_b = axisExtrema.max) !== null && _b !== void 0 ? _b : max];
}
