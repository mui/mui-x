"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridChartsRendererProxy = GridChartsRendererProxy;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useGridChartIntegration_1 = require("../hooks/utils/useGridChartIntegration");
var useGridChartsIntegration_1 = require("../hooks/features/chartsIntegration/useGridChartsIntegration");
function GridChartsRendererProxy(props) {
    var Renderer = props.renderer, id = props.id, label = props.label, onRender = props.onRender;
    var _a = (0, useGridChartIntegration_1.useGridChartsIntegrationContext)(), chartStateLookup = _a.chartStateLookup, setChartState = _a.setChartState;
    React.useEffect(function () {
        if (!chartStateLookup[id]) {
            // With this, the proxy "registers" the chart to the context
            setChartState(id, __assign(__assign({}, useGridChartsIntegration_1.EMPTY_CHART_INTEGRATION_CONTEXT_STATE), { label: label }));
        }
        return function () {
            delete chartStateLookup[id];
        };
    }, [id, label, setChartState, chartStateLookup]);
    if (!chartStateLookup[id]) {
        return null;
    }
    var _b = chartStateLookup[id], dimensions = _b.dimensions, values = _b.values, type = _b.type, configuration = _b.configuration;
    return ((0, jsx_runtime_1.jsx)(Renderer, { dimensions: dimensions, values: values, chartType: type, configuration: configuration, onRender: onRender }));
}
GridChartsRendererProxy.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The unique identifier for the chart.
     */
    id: prop_types_1.default.string.isRequired,
    /**
     * The label for the chart.
     */
    label: prop_types_1.default.string,
    /**
     * Callback function called when the chart is about to be rendered.
     * Use this to check and modify the chart props before it is rendered.
     */
    onRender: prop_types_1.default.func,
    /**
     * The renderer component that will render the chart.
     */
    renderer: prop_types_1.default.func.isRequired,
};
