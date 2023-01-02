import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DATA_GRID_PRO_PROPS_DEFAULT_VALUES, GRID_DEFAULT_LOCALE_TEXT } from '@mui/x-data-grid-pro';
import {
  DataGridPremiumProps,
  DataGridPremiumProcessedProps,
  DataGridPremiumPropsWithDefaultValue,
} from '../models/dataGridPremiumProps';
import { GridPremiumSlotsComponent } from '../models';
import { GRID_AGGREGATION_FUNCTIONS } from '../hooks/features/aggregation';
import { DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridPremiumDefaultSlotsComponents';

/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
export const DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES: DataGridPremiumPropsWithDefaultValue = {
  ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  unstable_cellSelection: false,
  disableAggregation: false,
  disableRowGrouping: false,
  rowGroupingColumnMode: 'single',
  aggregationFunctions: GRID_AGGREGATION_FUNCTIONS,
  aggregationRowsScope: 'filtered',
  getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
};

export const useDataGridPremiumProps = (inProps: DataGridPremiumProps) => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const components = React.useMemo<GridPremiumSlotsComponent>(() => {
    const overrides = themedProps.components;

    if (!overrides) {
      return { ...DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridPremiumSlotsComponent;

    type GridSlots = keyof GridPremiumSlotsComponent;
    Object.entries(DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS).forEach(
      ([key, defaultComponent]) => {
        mergedComponents[key as GridSlots] =
          overrides[key as GridSlots] === undefined
            ? defaultComponent
            : overrides[key as GridSlots];
      },
    );

    return mergedComponents;
  }, [themedProps.components]);

  return React.useMemo<DataGridPremiumProcessedProps>(
    () => ({
      ...DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      components,
      signature: 'DataGridPremium',
    }),
    [themedProps, localeText, components],
  );
};
