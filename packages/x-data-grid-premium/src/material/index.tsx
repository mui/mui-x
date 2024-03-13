import * as React from 'react'
import { DataGridPremiumRaw, DataGridPremiumProps } from '../core';
import { materialProProps, materialProSlots } from '@mui/x-data-grid-pro/material';
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
  return (
    <DataGridPremiumRaw
      {...materialPremiumProps}
      {...props}
      slots={React.useMemo(() => ({ ...materialPremiumSlots, ...props.slots }), [props.slots])}
    />
  )
}
