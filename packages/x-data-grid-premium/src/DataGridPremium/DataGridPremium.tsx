'use client';
import * as React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
import materialSlotsCommunity from '@mui/x-data-grid/material';
import materialSlotsPro from '@mui/x-data-grid-pro/material';
import { DataGridPremiumProps } from '../models/dataGridPremiumProps';
import materialSlotsPremium from '../material';
import { DataGridPremiumHeadless } from './DataGridPremiumHeadless';

export const DataGridPremium = React.forwardRef(function DataGrid<R extends GridValidRowModel>(
  inProps: DataGridPremiumProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const slotsWithMaterial = React.useMemo(
    () => ({
      ...materialSlotsCommunity,
      ...materialSlotsPro,
      ...materialSlotsPremium,
      ...inProps.slots,
    }),
    [inProps.slots],
  );

  return <DataGridPremiumHeadless {...inProps} slots={slotsWithMaterial} ref={ref} />;
});
