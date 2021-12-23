import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DEFAULT_GRID_SLOTS_COMPONENTS } from '../../_modules_/grid/constants/defaultGridSlotsComponents';
import { GRID_DEFAULT_LOCALE_TEXT, GridSlotsComponent } from '../../_modules_';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
} from '../../_modules_/grid/models/props/DataGridProProps';

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
      localeText,
      components,
      signature: 'DataGridPro',
    }),
    [themedProps, localeText, components],
  );
};
