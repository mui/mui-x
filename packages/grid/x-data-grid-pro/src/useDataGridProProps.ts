import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DEFAULT_GRID_SLOTS_COMPONENTS } from '../../_modules_/grid/constants/defaultGridSlotsComponents';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../_modules_/grid/models/props/DataGridProps';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../_modules_/grid/constants/localeTextConstants';
import { GridSlotsComponent } from '../../_modules_/grid/models/gridSlotsComponent';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DataGridProPropsWithDefaultValue,
} from './internals/models/dataGridProProps';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  disableColumnPinning: false,
  disableRowGrouping: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowGroupingColumnMode: 'single',
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
      return { ...DEFAULT_GRID_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridSlotsComponent;

    Object.keys(DEFAULT_GRID_SLOTS_COMPONENTS).forEach((key) => {
      mergedComponents[key] =
        overrides[key] === undefined ? DEFAULT_GRID_SLOTS_COMPONENTS[key] : overrides[key];
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
