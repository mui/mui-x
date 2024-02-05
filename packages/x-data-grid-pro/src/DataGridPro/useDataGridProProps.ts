import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  GRID_DEFAULT_LOCALE_TEXT,
  DATA_GRID_PROPS_DEFAULT_VALUES,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { computeSlots, useProps } from '@mui/x-data-grid/internals';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DataGridProPropsWithDefaultValue,
} from '../models/dataGridProProps';
import { GridProSlotsComponent } from '../models';
import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridProDefaultSlotsComponents';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  autosizeOnMount: false,
  disableAutosize: false,
  disableColumnPinning: false,
  keepColumnPositionIfDraggedOutside: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowReordering: false,
  rowsLoadingMode: 'client',
  getDetailPanelHeight: () => 500,
  headerFilters: false,
};

const defaultSlots = DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;

export const useDataGridProProps = <R extends GridValidRowModel>(inProps: DataGridProProps<R>) => {
  const themedProps = useProps(
    useThemeProps({
      props: inProps,
      name: 'MuiDataGrid',
    }),
  );

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<GridProSlotsComponent>(
    () =>
      computeSlots<GridProSlotsComponent>({
        defaultSlots,
        slots: themedProps.slots,
      }),
    [themedProps.slots],
  );

  return React.useMemo<DataGridProProcessedProps<R>>(
    () => ({
      ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      slots,
      signature: 'DataGridPro',
    }),
    [themedProps, localeText, slots],
  );
};
