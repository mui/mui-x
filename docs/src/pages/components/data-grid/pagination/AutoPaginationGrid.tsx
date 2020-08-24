import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function AutoPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        autoPageSize
        pagination
        rows={data.rows}
        columns={data.columns}
      />
    </div>
  );
}
