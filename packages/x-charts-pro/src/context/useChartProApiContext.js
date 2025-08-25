"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartProApiContext = useChartProApiContext;
var context_1 = require("@mui/x-charts/context");
/**
 * The `useChartProApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartDataProvider` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartProApiContext<ChartProApi<'bar'>>();
 */
function useChartProApiContext() {
    return (0, context_1.useChartApiContext)();
}
