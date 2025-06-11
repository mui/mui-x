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
    chartsIntegration.categories.map((category) =>
      rowGroupingModel.includes(category)
        ? getRowGroupingFieldFromGroupingCriteria(
            columns.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) ? null : category,
          )
        : category,
    ),
);

export const gridChartsSeriesSelector = createSelectorMemoized(
  gridChartsIntegrationStateSelector,
  gridColumnFieldsSelector,
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, columns, rowGroupingModel) =>
    chartsIntegration.series.map((seriesItem) =>
      rowGroupingModel.includes(seriesItem)
        ? getRowGroupingFieldFromGroupingCriteria(
            columns.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) ? null : seriesItem,
          )
        : seriesItem,
    ),
);
