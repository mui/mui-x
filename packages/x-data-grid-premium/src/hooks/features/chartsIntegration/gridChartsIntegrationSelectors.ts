import { GridColumnLookup } from '@mui/x-data-grid';
import {
  createRootSelector,
  createSelector,
  createSelectorMemoized,
  gridColumnLookupSelector,
  gridPivotActiveSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { gridSidebarStateSelector, GridSidebarValue } from '../sidebar';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';

const gridChartsIntegrationStateSelector = createRootSelector(
  (state: GridStatePremium) => state.chartsIntegration,
);

export const gridChartsIntegrationActiveChartIdSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.activeChartId,
);

export const gridChartsIntegrationChartsLookupSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.charts,
);

export const gridChartsPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebar) => sidebar.value === GridSidebarValue.Charts && sidebar.open,
);

export const gridChartableColumnsSelector = createSelectorMemoized(
  gridColumnLookupSelector,
  gridPivotActiveSelector,
  gridPivotModelSelector,
  (columns, pivotActive, pivotModel) => {
    let chartableColumns = Object.values(columns).filter((column) => column.chartable);
    if (pivotActive) {
      const pivotColumns = pivotModel.columns
        .filter((column) => column.hidden !== true)
        .map((column) => column.field);
      const pivotValues = pivotModel.values
        .filter((value) => value.hidden !== true)
        .map((value) => value.field);
      // pivot columns are not visualized
      // once the columns are set, value fields are created dynamically. those fields remain chartable, but we remove the initial value columns
      if (pivotColumns.length > 0) {
        chartableColumns = chartableColumns.filter(
          (column) => !pivotColumns.includes(column.field) && !pivotValues.includes(column.field),
        );
      }
    }

    return chartableColumns.reduce((acc, column) => {
      acc[column.field] = column;
      return acc;
    }, {} as GridColumnLookup);
  },
);

export const gridChartsDimensionsSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration, chartId) => chartsIntegration.charts[chartId]?.dimensions || [],
);

export const gridChartsValuesSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration, chartId) => chartsIntegration.charts[chartId]?.values || [],
);
