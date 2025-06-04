import { createRootSelector, createSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

const gridChartsIntegrationStateSelector = createRootSelector(
  (state: GridStatePremium) => state.chartsIntegration,
);

export const gridChartsConfigurationPanelOpenSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.configurationPanel.open,
);

export const gridChartsCategoriesSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.categories,
);

export const gridChartsSeriesSelector = createSelector(
  gridChartsIntegrationStateSelector,
  (chartsIntegration) => chartsIntegration.series,
);
