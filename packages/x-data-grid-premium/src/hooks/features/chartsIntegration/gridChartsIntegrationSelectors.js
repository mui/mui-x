"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridChartsValuesSelector = exports.gridChartsDimensionsSelector = exports.gridChartableColumnsSelector = exports.gridChartsPanelOpenSelector = exports.gridChartsIntegrationChartsLookupSelector = exports.gridChartsIntegrationActiveChartIdSelector = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var sidebar_1 = require("../sidebar");
var gridPivotingSelectors_1 = require("../pivoting/gridPivotingSelectors");
var gridChartsIntegrationStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.chartsIntegration; });
exports.gridChartsIntegrationActiveChartIdSelector = (0, internals_1.createSelector)(gridChartsIntegrationStateSelector, function (chartsIntegration) { return chartsIntegration.activeChartId; });
exports.gridChartsIntegrationChartsLookupSelector = (0, internals_1.createSelector)(gridChartsIntegrationStateSelector, function (chartsIntegration) { return chartsIntegration.charts; });
exports.gridChartsPanelOpenSelector = (0, internals_1.createSelector)(sidebar_1.gridSidebarStateSelector, function (sidebar) { return sidebar.value === sidebar_1.GridSidebarValue.Charts && sidebar.open; });
exports.gridChartableColumnsSelector = (0, internals_1.createSelectorMemoized)(internals_1.gridColumnLookupSelector, internals_1.gridPivotActiveSelector, gridPivotingSelectors_1.gridPivotModelSelector, function (columns, pivotActive, pivotModel) {
    var chartableColumns = Object.values(columns).filter(function (column) { return column.chartable; });
    if (pivotActive) {
        var pivotColumns_1 = pivotModel.columns
            .filter(function (column) { return column.hidden !== true; })
            .map(function (column) { return column.field; });
        var pivotValues_1 = pivotModel.values
            .filter(function (value) { return value.hidden !== true; })
            .map(function (value) { return value.field; });
        // pivot columns are not visualized
        // once the columns are set, value fields are created dynamically. those fields remain chartable, but we remove the initial value columns
        if (pivotColumns_1.length > 0) {
            chartableColumns = chartableColumns.filter(function (column) { return !pivotColumns_1.includes(column.field) && !pivotValues_1.includes(column.field); });
        }
    }
    return chartableColumns.reduce(function (acc, column) {
        acc[column.field] = column;
        return acc;
    }, {});
});
exports.gridChartsDimensionsSelector = (0, internals_1.createSelector)(gridChartsIntegrationStateSelector, function (chartsIntegration, chartId) { var _a; return ((_a = chartsIntegration.charts[chartId]) === null || _a === void 0 ? void 0 : _a.dimensions) || []; });
exports.gridChartsValuesSelector = (0, internals_1.createSelector)(gridChartsIntegrationStateSelector, function (chartsIntegration, chartId) { var _a; return ((_a = chartsIntegration.charts[chartId]) === null || _a === void 0 ? void 0 : _a.values) || []; });
