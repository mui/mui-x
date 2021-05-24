import * as React from 'react';
import { DataGrid, GridRowParams } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function DisableRowSelection() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        isRowSelectable={(params: GridRowParams) => params.row.quantity > 50000}
        checkboxSelection
      />
    </div>
  );
}
