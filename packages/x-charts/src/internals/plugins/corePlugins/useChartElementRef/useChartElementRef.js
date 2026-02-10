"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartElementRef = void 0;
var React = require("react");
var useChartElementRef = function () {
    var svgRef = React.useRef(null);
    var chartRootRef = React.useRef(null);
    return {
        instance: {
            svgRef: svgRef,
            chartRootRef: chartRootRef,
        },
    };
};
exports.useChartElementRef = useChartElementRef;
exports.useChartElementRef.params = {};
