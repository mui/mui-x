import * as React from 'react';
import { DataGrid, GridSortDirection } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function OrderSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        sortingOrder={['desc', 'asc']}
        sortModel={[
          {
            field: 'commodity',
            sort: 'asc' as GridSortDirection,
          },
        ]}
        {...data}
      />
    </div>
  );
}
