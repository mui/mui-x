import * as React from 'react';
import { DataGridPro, dataGridClasses } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function CellFocusNoOutline() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        sx={{
          [`& .${dataGridClasses.cell}:focus, & .${dataGridClasses.cell}:focus-within`]:
            {
              outline: 'none',
            },
          [`& .${dataGridClasses.columnHeader}:focus, & .${dataGridClasses.columnHeader}:focus-within`]:
            {
              outline: 'none',
            },
        }}
        {...data}
      />
    </div>
  );
}
