"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartGradientIdBuilder = useChartGradientIdBuilder;
exports.useChartGradientIdObjectBoundBuilder = useChartGradientIdObjectBoundBuilder;
exports.useChartGradientId = useChartGradientId;
exports.useChartGradientIdObjectBound = useChartGradientIdObjectBound;
var React = require("react");
var useChartId_1 = require("./useChartId");
/**
 * Returns a function that generates a gradient id for the given axis id.
 */
function useChartGradientIdBuilder() {
    var chartId = (0, useChartId_1.useChartId)();
    return React.useCallback(function (axisId) { return "".concat(chartId, "-gradient-").concat(axisId); }, [chartId]);
}
/**
 * Returns a function that generates a gradient id for the given axis id.
 */
function useChartGradientIdObjectBoundBuilder() {
    var chartId = (0, useChartId_1.useChartId)();
    return React.useCallback(function (axisId) { return "".concat(chartId, "-gradient-").concat(axisId, "-object-bound"); }, [chartId]);
}
/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * For a gradient that respects the coordinates of the object on which it is applied, use `useChartGradientIdObjectBound` instead.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
function useChartGradientId(axisId) {
    return useChartGradientIdBuilder()(axisId);
}
/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * This gradient differs from `useChartGradientId` in that it respects the coordinates of the object on which it is applied.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
function useChartGradientIdObjectBound(axisId) {
    return useChartGradientIdObjectBoundBuilder()(axisId);
}
