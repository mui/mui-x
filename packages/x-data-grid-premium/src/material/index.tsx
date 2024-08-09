import * as React from 'react'
import { useThemeProps } from '@mui/material';
import { materialProProps, materialProSlots } from '@mui/x-data-grid-pro/material';
import { DataGridPremiumRaw, DataGridPremiumProps } from '../core';
import type { GridPremiumIconSlotsComponent } from '../models';
import { GridWorkspacesIcon, GridGroupWorkIcon, GridFunctionsIcon } from './icons';

const iconsPremiumSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
};

export const materialPremiumSlots = {
  ...iconsPremiumSlots,
  ...materialProSlots,
};

export const materialPremiumProps = materialProProps as Partial<DataGridPremiumProps>;


/**
 * Demos:
 * - [DataGridPremium](https://mui.com/x/react-data-grid/demo/)
 *
 * API:
 * - [DataGridPremium API](https://mui.com/x/api/data-grid/data-grid-premium/)
 */
export const DataGridPremiumMaterial = function DataGridPremiumMaterial(props: DataGridPremiumProps) {
  const themedProps = useThemeProps({
    props,
    name: 'MuiDataGrid',
  });

  return (
    <DataGridPremiumRaw
      {...materialPremiumProps}
      {...themedProps}
      slots={React.useMemo(() => ({ ...materialPremiumSlots, ...props.slots }), [props.slots])}
    />
  )
}
