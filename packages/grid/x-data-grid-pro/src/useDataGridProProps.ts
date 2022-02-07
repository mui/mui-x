import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  DATA_GRID_PROPS_DEFAULT_VALUES,
  GRID_DEFAULT_LOCALE_TEXT,
  GridSlotsComponent,
} from '@mui/x-data-grid';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DataGridProPropsWithDefaultValue,
} from './internals/models/dataGridProProps';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  disableColumnPinning: false,
  disableRowGrouping: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowGroupingColumnMode: 'single',
  getDetailPanelHeight: () => 500,
};

export const useDataGridProProps = (inProps: DataGridProProps) => {
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

    Object.keys(DATA_GRID_DEFAULT_SLOTS_COMPONENTS).forEach((key) => {
      mergedComponents[key] =
        overrides[key] === undefined ? DATA_GRID_DEFAULT_SLOTS_COMPONENTS[key] : overrides[key];
    });

    return mergedComponents;
  }, [themedProps.components]);

  return React.useMemo<DataGridProProcessedProps>(
    () => ({
      ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
      ...themedProps,
      disableRowGrouping:
        themedProps.disableRowGrouping || !themedProps.experimentalFeatures?.rowGrouping,
      localeText,
      components,
      signature: 'DataGridPro',
    }),
    [themedProps, localeText, components],
  );
};
