"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartApiContext = useChartApiContext;
var React = require("react");
var ChartsProvider_1 = require("./ChartsProvider");
/**
 * The `useChartApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartsDataProvider` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartApiContext<ChartApi<'bar'>>();
 */
function useChartApiContext() {
    var publicAPI = (0, ChartsProvider_1.useChartsContext)().publicAPI;
    var apiRef = React.useRef(publicAPI);
    React.useEffect(function () {
        apiRef.current = publicAPI;
    }, [publicAPI]);
    return apiRef;
}
