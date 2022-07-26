import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  GRID_DEFAULT_LOCALE_TEXT,
  GridSlotsComponent,
} from '@mui/x-data-grid-pro';
import {
  DataGridPremiumProps,
  DataGridPremiumProcessedProps,
  DataGridPremiumPropsWithDefaultValue,
} from '../models/dataGridPremiumProps';
import { PRIVATE_GRID_AGGREGATION_FUNCTIONS } from '../hooks/features/aggregation';

/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
export const DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES: DataGridPremiumPropsWithDefaultValue = {
  ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  private_disableAggregation: false,
  disableRowGrouping: false,
  rowGroupingColumnMode: 'single',
  private_aggregationFunctions: PRIVATE_GRID_AGGREGATION_FUNCTIONS,
  private_aggregationRowsScope: 'filtered',
  private_getAggregationPosition: (groupNode) => (groupNode == null ? 'footer' : 'inline'),
};

export const useDataGridPremiumProps = (inProps: DataGridPremiumProps) => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const components = React.useMemo<GridSlotsComponent>(() => {
    const overrides = themedProps.components;

    if (!overrides) {
      return { ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridSlotsComponent;

    type GridSlots = keyof GridSlotsComponent;
    Object.entries(DATA_GRID_DEFAULT_SLOTS_COMPONENTS).forEach(([key, defaultComponent]) => {
      mergedComponents[key as GridSlots] =
        overrides[key as GridSlots] === undefined ? defaultComponent : overrides[key as GridSlots];
    });

    return mergedComponents;
  }, [themedProps.components]);

  return React.useMemo<DataGridPremiumProcessedProps>(
    () => ({
      ...DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES,
      ...themedProps,
      private_disableAggregation:
        themedProps.private_disableAggregation ||
        !themedProps.experimentalFeatures?.private_aggregation,
      localeText,
      components,
      signature: 'DataGridPremium',
    }),
    [themedProps, localeText, components],
  );
};
