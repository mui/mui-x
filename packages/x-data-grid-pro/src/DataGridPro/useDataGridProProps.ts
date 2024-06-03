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

interface GetDataGridProPropsDefaultValues extends DataGridProProps {}

type DataGridProForcedProps = { [key in keyof DataGridProProps]?: DataGridProProcessedProps[key] };
type GetDataGridProForcedProps = (
  themedProps: GetDataGridProPropsDefaultValues,
) => DataGridProForcedProps;

const GET_DATA_GRID_PRO_FORCED_PROPS: GetDataGridProForcedProps = (themedProps) => ({
  signature: 'DataGridPro',
  ...(themedProps.unstable_dataSource
    ? {
        filterMode: 'server',
        sortingMode: 'server',
        paginationMode: 'server',
      }
    : {}),
});

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  disableDataSourceCache: false,
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

const GET_DATA_GRID_PRO_PROPS_DEFAULT_VALUES: (
  themedProps: GetDataGridProPropsDefaultValues,
) => DataGridProPropsWithDefaultValue = (themedProps) => ({
  ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  filterDebounceMs: themedProps.unstable_dataSource
    ? 1000
    : DATA_GRID_PROPS_DEFAULT_VALUES.filterDebounceMs,
});

const defaultSlots = DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;

export const useDataGridProProps = <R extends GridValidRowModel>(inProps: DataGridProProps<R>) => {
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
      ...GET_DATA_GRID_PRO_PROPS_DEFAULT_VALUES(themedProps),
      ...themedProps,
      localeText,
      slots,
      ...GET_DATA_GRID_PRO_FORCED_PROPS(themedProps),
    }),
    [themedProps, localeText, slots],
  );
};
