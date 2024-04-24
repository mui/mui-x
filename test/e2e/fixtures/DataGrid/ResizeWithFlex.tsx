import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'column1', flex: 1 },
  { field: 'column2', flex: 1 },
  { field: 'column3', flex: 1 },
  { field: 'column4', flex: 0 },
  { field: 'column5', flex: 0 },
];

const columnGroupingModel = [
  {
    groupId: 'group1',
    children: [
      { field: 'column1' },
      {
        groupId: 'group1.1',
        children: [{ field: 'column2' }, { field: 'column3' }, { field: 'column4' }],
      },
    ],
  },
  {
    groupId: 'group2',
    children: [{ field: 'column5' }],
  },
];

export default function ResizeWithFlex() {
  return (
    <div style={{ width: 700, height: 300 }}>
      <DataGrid columns={columns} rows={[]} columnGroupingModel={columnGroupingModel} />
    </div>
  );
}
