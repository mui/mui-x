import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const baselineProps = {
  rows: Array.from({ length: 100 }).map((a, index) => ({
    id: index,
    column0: `${index}-0`,
    column1: `${index}-1`,
    column2: `${index}-2`,
  })),
  columns: [
    { field: 'column0', editable: true },
    { field: 'column1', editable: true },
    { field: 'column2', editable: true },
  ],
};

export default function RowEditingWithPinnedColumns() {
  return (
    <div style={{ width: 300, height: 400 }}>
      <DataGridPro
        {...baselineProps}
        initialState={{
          pinnedColumns: {
            left: ['column0'],
            right: ['column2'],
          },
        }}
        editMode="row"
      />
    </div>
  );
}
