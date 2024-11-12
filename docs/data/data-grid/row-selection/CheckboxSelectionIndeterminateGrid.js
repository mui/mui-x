import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CheckboxSelectionIndeterminateGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <DataGrid {...data} checkboxSelection indeterminateCheckboxAction="select" />
    </div>
  );
}
