import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  GRID_DEFAULT_LOCALE_TEXT,
  DATA_GRID_PROPS_DEFAULT_VALUES,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { uncapitalizeObjectKeys } from '@mui/x-data-grid/internals';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DataGridProPropsWithDefaultValue,
} from '../models/dataGridProProps';
import { UncapitalizedGridProSlotsComponent } from '../models';
import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridProDefaultSlotsComponents';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  disableColumnPinning: false,
  keepColumnPositionIfDraggedOutside: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowReordering: false,
  rowsLoadingMode: 'client',
  getDetailPanelHeight: () => 500,
};

export const useDataGridProProps = <R extends GridValidRowModel>(inProps: DataGridProProps<R>) => {
  const { components, componentsProps, ...themedProps } = useThemeProps({
    props: inProps,
    name: 'MuiDataGrid',
  });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<UncapitalizedGridProSlotsComponent>(() => {
    const uncapitalizedDefaultSlots = uncapitalizeObjectKeys(
      DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
    )!;
    const overrides = themedProps.slots ?? (components ? uncapitalizeObjectKeys(components) : null);

    if (!overrides) {
      return { ...uncapitalizedDefaultSlots };
    }

    type GridSlot = keyof UncapitalizedGridProSlotsComponent;
    return Object.entries(uncapitalizedDefaultSlots).reduce((acc, [key, defaultComponent]) => {
      const override = overrides[key as GridSlot];
      const component = override !== undefined ? override : defaultComponent;
      return { ...acc, [key as GridSlot]: component };
    }, {} as UncapitalizedGridProSlotsComponent);
  }, [components, themedProps.slots]);

  return React.useMemo<DataGridProProcessedProps<R>>(
    () => ({
      ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      slots,
      slotProps: themedProps.slotProps ?? componentsProps,
      signature: 'DataGridPro',
    }),
    [themedProps, localeText, slots, componentsProps],
  );
};
