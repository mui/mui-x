import * as React from 'react';
import { DataGrid } from '@material-next/data-grid';
import { useDemoData } from '@material-next/x-grid-data-generator';

export default function SizePaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        {...data}
      />
    </div>
  );
}
