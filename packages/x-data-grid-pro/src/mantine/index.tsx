import * as React from 'react'
import { materialSlots, materialProps } from '@mui/x-data-grid/material';
import { DataGridProRaw } from '../DataGridPro';
import { DataGridProProps } from '../models/dataGridProProps';
import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon } from './icons';

const iconProSlots: GridProIconSlotsComponent = {
  columnMenuPinRightIcon: GridPushPinRightIcon,
  columnMenuPinLeftIcon: GridPushPinLeftIcon,
};

export const materialProSlots = {
  ...materialSlots,
  ...iconProSlots,
};

export const materialProProps = materialProps as Partial<DataGridProProps>;

/**
 * Demos:
 * - [DataGridPro](https://mui.com/x/react-data-grid/demo/)
 *
 * API:
 * - [DataGridPro API](https://mui.com/x/api/data-grid/data-grid-pro/)
 */
export const DataGridPro = function DataGridPro(props: DataGridProProps) {
  return (
    <DataGridProRaw
      {...materialProProps}
      {...props}
      slots={React.useMemo(() => ({ ...materialProSlots, ...props.slots }), [props.slots])}
    />
  )
}

export * from '../core'
