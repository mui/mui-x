import * as React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

const baselineProps: DataGridProps = {
  rows: [
    {
      id: 0,
      birthday: new Date(1984, 1, 29),
      lastConnection: new Date(2022, 1, 20, 6, 50, 0),
    },
  ],
  columns: [
    { field: 'birthday', type: 'date', editable: true, width: 120 },
    { field: 'lastConnection', type: 'dateTime', editable: true, width: 180 },
  ],
};

export default function KeyboardEditDate() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...baselineProps} />
    </div>
  );
}
