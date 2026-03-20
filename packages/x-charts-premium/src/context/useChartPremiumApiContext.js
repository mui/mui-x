"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartPremiumApiContext = useChartPremiumApiContext;
var context_1 = require("@mui/x-charts/context");
/**
 * The `useChartPremiumApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartsDataProviderPremium` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartPremiumApiContext<ChartPremiumApi<'bar'>>();
 */
function useChartPremiumApiContext() {
    return (0, context_1.useChartApiContext)();
}
