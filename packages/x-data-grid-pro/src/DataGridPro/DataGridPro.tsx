'use client';
import * as React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
import materialSlotsCommunity from '@mui/x-data-grid/material';
import materialSlotsPro from '@mui/x-data-grid-pro/material';
import { DataGridProProps } from '../models/dataGridProProps';
import { DataGridProHeadless } from './DataGridProHeadless';

export const DataGridPro = React.forwardRef(function DataGrid<R extends GridValidRowModel>(
  inProps: DataGridProProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const slotsWithMaterial = React.useMemo(
    () => ({
      ...materialSlotsCommunity,
      ...materialSlotsPro,
      ...inProps.slots,
    }),
    [inProps.slots],
  );

  return <DataGridProHeadless {...inProps} slots={slotsWithMaterial} ref={ref} />;
});
