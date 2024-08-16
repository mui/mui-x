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
  autosizeOnMount: false,
  checkboxSelection: false,
  checkboxSelectionVisibleOnly: false,
  clipboardCopyCellDelimiter: '\t',
  columnBufferPx: 150,
  columnHeaderHeight: 56,
  disableAutosize: false,
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnReorder: false,
  disableColumnResize: false,
  disableColumnSelector: false,
  disableColumnSorting: false,
  disableDensitySelector: false,
  disableEval: false,
  disableMultipleColumnsFiltering: false,
  disableMultipleColumnsSorting: false,
  disableMultipleRowSelection: false,
  disableRowSelectionOnClick: false,
  disableVirtualization: false,
  editMode: GridEditModes.Cell,
  filterDebounceMs: 150,
  filterMode: 'client',
  hideFooter: false,
  hideFooterPagination: false,
  hideFooterRowCount: false,
  hideFooterSelectedRowCount: false,
  ignoreDiacritics: false,
  ignoreValueFormatterDuringExport: false,
  keepColumnPositionIfDraggedOutside: false,
  keepNonExistentRowsSelected: false,
  loading: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? ('error' as const) : ('warn' as const),
  pageSizeOptions: [25, 50, 100],
  pagination: false,
  paginationMode: 'client',
  resizeThrottleMs: 60,
  rowBufferPx: 150,
  rowHeight: 52,
  rowPositionsDebounceMs: 166,
  rows: [],
  rowSelection: true,
  rowSpacingType: 'margin',
  showCellVerticalBorder: false,
  showColumnVerticalBorder: false,
  sortingMode: 'client',
  sortingOrder: ['asc' as const, 'desc' as const, null],
  throttleRowsMs: 0,
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
