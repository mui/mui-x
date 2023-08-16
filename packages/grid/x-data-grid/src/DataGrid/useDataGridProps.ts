import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DataGridProcessedProps,
  DataGridProps,
  DataGridForcedPropsKey,
  DataGridPropsWithDefaultValues,
} from '../models/props/DataGridProps';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants';
import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '../constants/defaultGridSlotsComponents';
import { GridEditModes, GridSlotsComponent, GridValidRowModel } from '../models';
import {
  computeSlots,
  useProps,
  uncapitalizeObjectKeys,
  UncapitalizeObjectKeys,
} from '../internals/utils';

const DATA_GRID_FORCED_PROPS: { [key in DataGridForcedPropsKey]?: DataGridProcessedProps[key] } = {
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleRowSelection: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  checkboxSelectionVisibleOnly: false,
  disableColumnReorder: true,
  disableColumnResize: true,
  keepColumnPositionIfDraggedOutside: false,
  signature: 'DataGrid',
};

/**
 * The default values of `DataGridPropsWithDefaultValues` to inject in the props of DataGrid.
 */
export const DATA_GRID_PROPS_DEFAULT_VALUES: DataGridPropsWithDefaultValues = {
  autoHeight: false,
  autoPageSize: false,
  checkboxSelection: false,
  checkboxSelectionVisibleOnly: false,
  columnBuffer: 3,
  rowBuffer: 3,
  columnThreshold: 3,
  rowThreshold: 3,
  rowSelection: true,
  density: 'standard',
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableEval: false,
  disableMultipleColumnsFiltering: false,
  disableMultipleRowSelection: false,
  disableMultipleColumnsSorting: false,
  disableRowSelectionOnClick: false,
  disableVirtualization: false,
  editMode: GridEditModes.Cell,
  filterMode: 'client',
  filterDebounceMs: 150,
  columnHeaderHeight: 56,
  hideFooter: false,
  hideFooterPagination: false,
  hideFooterRowCount: false,
  hideFooterSelectedRowCount: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? ('error' as const) : ('warn' as const),
  pagination: false,
  paginationMode: 'client',
  rowHeight: 52,
  pageSizeOptions: [25, 50, 100],
  rowSpacingType: 'margin',
  showCellVerticalBorder: false,
  showColumnVerticalBorder: false,
  sortingOrder: ['asc' as const, 'desc' as const, null],
  sortingMode: 'client',
  throttleRowsMs: 0,
  disableColumnReorder: false,
  disableColumnResize: false,
  keepNonExistentRowsSelected: false,
  keepColumnPositionIfDraggedOutside: false,
  unstable_ignoreValueFormatterDuringExport: false,
  clipboardCopyCellDelimiter: '\t',
};

const defaultSlots = uncapitalizeObjectKeys(DATA_GRID_DEFAULT_SLOTS_COMPONENTS)!;

export const useDataGridProps = <R extends GridValidRowModel>(inProps: DataGridProps<R>) => {
  const [components, componentsProps, themedProps] = useProps(
    useThemeProps({
      props: inProps,
      name: 'MuiDataGrid',
    }),
  );

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<UncapitalizeObjectKeys<GridSlotsComponent>>(
    () =>
      computeSlots<GridSlotsComponent>({
        defaultSlots,
        slots: themedProps.slots,
        components,
      }),
    [components, themedProps.slots],
  );

  return React.useMemo<DataGridProcessedProps<R>>(
    () => ({
      ...DATA_GRID_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      slots,
      slotProps: themedProps.slotProps ?? componentsProps,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [themedProps, localeText, slots, componentsProps],
  );
};
