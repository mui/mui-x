import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DataGridProcessedProps,
  DataGridProps,
  DataGridForcedPropsKey,
  DATA_GRID_PROPS_DEFAULT_VALUES,
} from '../../_modules_/grid/models/props/DataGridProps';

import { DEFAULT_GRID_SLOTS_COMPONENTS } from '../../_modules_/grid/constants/defaultGridSlotsComponents';
import { GRID_DEFAULT_LOCALE_TEXT, GridSlotsComponent } from '../../_modules_';

const DATA_GRID_FORCED_PROPS: { [key in DataGridForcedPropsKey]?: DataGridProcessedProps[key] } = {
  apiRef: undefined,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  checkboxSelectionVisibleOnly: false,
  disableColumnReorder: true,
  disableColumnResize: true,
  signature: 'DataGrid',
};

export const MAX_PAGE_SIZE = 100;

export const useDataGridProps = (inProps: DataGridProps) => {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const components = React.useMemo<GridSlotsComponent>(() => {
    const overrides = themedProps.components;

    if (!overrides) {
      return { ...DEFAULT_GRID_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridSlotsComponent;

    Object.keys(DEFAULT_GRID_SLOTS_COMPONENTS).forEach((key) => {
      mergedComponents[key] =
        overrides[key] === undefined ? DEFAULT_GRID_SLOTS_COMPONENTS[key] : overrides[key];
    });

    return mergedComponents;
  }, [themedProps.components]);

  return React.useMemo<DataGridProcessedProps>(
    () => ({
      ...DATA_GRID_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      components,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [themedProps, localeText, components],
  );
};
