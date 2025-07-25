import { GridColumnLookup } from '@mui/x-data-grid';
import {
  createRootSelector,
  createSelector,
  createSelectorMemoized,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { getRowGroupingFieldFromGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';
import { gridPivotActiveSelector, gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import { gridSidebarStateSelector, GridSidebarValue } from '../sidebar';

const gridChartsIntegrationStateSelector = createRootSelector(
  (state: GridStatePremium) => state.chartsIntegration,
);

export const gridChartsIntegrationActiveChartIdSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.activeChartId,
);

export const gridChartsPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebar) => sidebar.value === GridSidebarValue.Charts && sidebar.open,
);

export const gridChartableColumnsSelector = createSelectorMemoized(
  gridColumnLookupSelector,
  gridRowGroupingSanitizedModelSelector,
  gridPivotActiveSelector,
  gridPivotModelSelector,
  (columns, rowGroupingModel, pivotActive, pivotModel) =>
    Object.values(columns)
      .filter(
        (column) =>
          column.chartable &&
          !rowGroupingModel.includes(column.field) &&
          (!pivotActive || !pivotModel.values.map((value) => value.field).includes(column.field)),
      )
      .reduce((acc, column) => {
        acc[column.field] = column;
        return acc;
      }, {} as GridColumnLookup),
);

export const gridChartsCategoriesSelector = createSelectorMemoized(
  gridChartsIntegrationStateSelector,
  gridColumnFieldsSelector,
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, columns, rowGroupingModel, chartId) =>
    (chartsIntegration.charts[chartId]?.categories || []).map((category) => ({
      ...category,
      field: rowGroupingModel.includes(category.field)
        ? getRowGroupingFieldFromGroupingCriteria(
            columns.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) ? null : category.field,
          )
        : category.field,
    })),
);

export const gridChartsSeriesSelector = createSelectorMemoized(
  gridChartsIntegrationStateSelector,
  gridColumnFieldsSelector,
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, columns, rowGroupingModel, chartId) =>
    (chartsIntegration.charts[chartId]?.series || []).map((seriesItem) => ({
      ...seriesItem,
      field: rowGroupingModel.includes(seriesItem.field)
        ? getRowGroupingFieldFromGroupingCriteria(
            columns.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) ? null : seriesItem.field,
          )
        : seriesItem.field,
    })),
);
