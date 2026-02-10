"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartContainerProps = void 0;
var useChartsContainerProps_1 = require("../ChartsContainer/useChartsContainerProps");
/**
 * @deprecated Use `useChartsContainerProps` instead.
 */
var useChartContainerProps = function (props, ref) {
    return (0, useChartsContainerProps_1.useChartsContainerProps)(props, ref);
};
exports.useChartContainerProps = useChartContainerProps;
