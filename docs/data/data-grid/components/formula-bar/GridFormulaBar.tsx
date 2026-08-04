import * as React from 'react';
import {
  DataGridPremium,
  FormulaBar,
  GridColDef,
  GridRowsProp,
} from '@mui/x-data-grid-premium';

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product', width: 160 },
  { field: 'q1', headerName: 'Q1', type: 'number', width: 90, editable: true },
  { field: 'q2', headerName: 'Q2', type: 'number', width: 90, editable: true },
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 130,
    allowFormulas: true,
    editable: true,
  },
];

const rows: GridRowsProp = [
  { id: 1, product: 'Widgets', q1: 320, q2: 410, total: '=q1 + q2' },
  { id: 2, product: 'Gadgets', q1: 150, q2: 220, total: '=q1 + q2' },
  { id: 3, product: 'Gizmos', q1: 80, q2: 95, total: '=q1 + q2' },
  {
    id: 4,
    product: 'All products',
    total: '=SUM(COLUMN_VALUES("q1")) + SUM(COLUMN_VALUES("q2"))',
  },
];

function CustomToolbar() {
  return <FormulaBar />;
}

export default function GridFormulaBar() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaA1Notation
        showToolbar
        slots={{ toolbar: CustomToolbar }}
        rowSelection={false}
        density="compact"
        disablePivoting
      />
    </div>
  );
}
