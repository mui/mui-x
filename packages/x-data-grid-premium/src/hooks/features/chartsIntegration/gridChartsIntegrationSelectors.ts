import {
  createRootSelector,
  createSelector,
  createSelectorMemoized,
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
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, rowGroupingModel) =>
    chartsIntegration.categories.map((category) =>
      rowGroupingModel.includes(category)
        ? getRowGroupingFieldFromGroupingCriteria(null)
        : category,
    ),
);

export const gridChartsSeriesSelector = createSelectorMemoized(
  gridChartsIntegrationStateSelector,
  gridRowGroupingSanitizedModelSelector,
  (chartsIntegration, rowGroupingModel) =>
    chartsIntegration.series.map((serie) =>
      rowGroupingModel.includes(serie) ? getRowGroupingFieldFromGroupingCriteria(null) : serie,
    ),
);
