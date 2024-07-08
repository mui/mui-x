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
import { computeSlots, useProps } from '../internals/utils';

const DATA_GRID_FORCED_PROPS: { [key in DataGridForcedPropsKey]?: DataGridProcessedProps[key] } = {
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  checkboxSelectionVisibleOnly: false,
  disableColumnReorder: true,
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
  columnBufferPx: 150,
  rowBufferPx: 150,
  rows: [],
  rowSelection: true,
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableEval: false,
  disableMultipleColumnsFiltering: false,
  disableMultipleRowSelection: false,
  disableColumnSorting: false,
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
  ignoreDiacritics: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? ('error' as const) : ('warn' as const),
  pagination: false,
  paginationMode: 'client',
  rowHeight: 52,
  resizeThrottleMs: 60,
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
  ignoreValueFormatterDuringExport: false,
  clipboardCopyCellDelimiter: '\t',
  rowPositionsDebounceMs: 166,
  autosizeOnMount: false,
  disableAutosize: false,
};

const defaultSlots = DATA_GRID_DEFAULT_SLOTS_COMPONENTS;

export const useDataGridProps = <R extends GridValidRowModel>(inProps: DataGridProps<R>) => {
  const themedProps = useProps(
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    useThemeProps({
      props: inProps,
      name: 'MuiDataGrid',
    }),
  );

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<GridSlotsComponent>(
    () =>
      computeSlots<GridSlotsComponent>({
        defaultSlots,
        slots: themedProps.slots,
      }),
    [themedProps.slots],
  );

  const injectDefaultProps = React.useMemo(() => {
    return (
      Object.keys(DATA_GRID_PROPS_DEFAULT_VALUES) as Array<
        keyof DataGridPropsWithDefaultValues<any>
      >
    ).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = themedProps[key] ?? DATA_GRID_PROPS_DEFAULT_VALUES[key];
      return acc;
    }, {} as DataGridPropsWithDefaultValues<any>);
  }, [themedProps]);

  return React.useMemo<DataGridProcessedProps<R>>(
    () => ({
      ...themedProps,
      ...injectDefaultProps,
      localeText,
      slots,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [themedProps, localeText, slots, injectDefaultProps],
  );
};
