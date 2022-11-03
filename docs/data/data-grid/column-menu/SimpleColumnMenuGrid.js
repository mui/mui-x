import * as React from 'react';
import { DataGrid, GridColumnMenuSimple } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SimpleColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} components={{ ColumnMenu: GridColumnMenuSimple }} />
    </div>
  );
}
