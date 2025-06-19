import {
  createRootSelector,
  createSelector,
  createSelectorMemoized,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { getRowGroupingFieldFromGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';

const gridChartsIntegrationStateSelector = createRootSelector(
  (state: GridStatePremium) => state.chartsIntegration,
);

export const gridChartsConfigurationPanelOpenSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.configurationPanel.open,
);

export const gridChartsCategoriesSelector = createSelectorMemoized(
  gridChartsIntegrationStateSelector,
  gridColumnFieldsSelector,
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, columns, rowGroupingModel) =>
    chartsIntegration.categories.map((category) => ({
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
  (chartsIntegration, columns, rowGroupingModel) =>
    chartsIntegration.series.map((seriesItem) => ({
      ...seriesItem,
      field: rowGroupingModel.includes(seriesItem.field)
        ? getRowGroupingFieldFromGroupingCriteria(
            columns.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) ? null : seriesItem.field,
          )
        : seriesItem.field,
    })),
);
