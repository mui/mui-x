import * as React from 'react';
import { DataGrid, GridHeader } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ColumnSelectorGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        components={{
          Header: GridHeader,
        }}
      />
    </div>
  );
}
