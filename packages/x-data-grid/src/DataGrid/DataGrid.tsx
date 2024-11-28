'use client';
import * as React from 'react';
import { GridValidRowModel } from '../models/gridRows';
import { DataGridHeadless } from './DataGridHeadless';
import { DataGridProps } from '../models/props/DataGridProps';
import materialSlotsCommunity from '../material';

export type { GridSlotsComponent as GridSlots } from '../models';

export const DataGrid = React.forwardRef(function DataGrid<R extends GridValidRowModel>(
  inProps: DataGridProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const slotsWithMaterial = React.useMemo(
    () => ({
      ...materialSlotsCommunity,
      ...inProps.slots,
    }),
    [inProps.slots],
  );

  return <DataGridHeadless {...inProps} slots={slotsWithMaterial} ref={ref} />;
});
