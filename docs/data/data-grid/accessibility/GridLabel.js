import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridLabel() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} label="Employees" showToolbar />
    </div>
  );
}
