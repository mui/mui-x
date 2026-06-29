import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const numberPastedValueParser = (value, _, column) => {
  if (column.type === 'number' && Number.isNaN(Number(value))) {
    return undefined;
  }
  return value;
};

const columns = [
  { field: 'product', headerName: 'Product', width: 150, editable: true },
  {
    field: 'region',
    headerName: 'Region',
    width: 120,
    editable: true,
  },
  {
    field: 'q1',
    headerName: 'Q1',
    type: 'number',
    pastedValueParser: numberPastedValueParser,
    width: 100,
    editable: true,
  },
  {
    field: 'q2',
    headerName: 'Q2',
    type: 'number',
    pastedValueParser: numberPastedValueParser,
    width: 100,
    editable: true,
  },
  {
    field: 'q3',
    headerName: 'Q3',
    type: 'number',
    pastedValueParser: numberPastedValueParser,
    width: 100,
    editable: true,
  },
  {
    field: 'q4',
    headerName: 'Q4',
    type: 'number',
    pastedValueParser: numberPastedValueParser,
    width: 100,
    editable: true,
  },
];

const initialRows = [
  {
    id: 1,
    product: 'Keyboard',
    region: 'North',
    q1: 240,
    q2: 300,
    q3: 280,
    q4: 350,
  },
  { id: 2, product: 'Mouse', region: 'North', q1: 180, q2: 210, q3: 190, q4: 230 },
  { id: 3, product: 'Monitor', region: 'South', q1: 120, q2: 150, q3: 140, q4: 160 },
  { id: 4, product: 'Webcam', region: 'South', q1: 90, q2: 110, q3: 100, q4: 130 },
  { id: 5, product: '', region: '', q1: 0, q2: 0, q3: 0, q4: 0 },
  { id: 6, product: '', region: '', q1: 0, q2: 0, q3: 0, q4: 0 },
  { id: 7, product: '', region: '', q1: 0, q2: 0, q3: 0, q4: 0 },
  { id: 8, product: '', region: '', q1: 0, q2: 0, q3: 0, q4: 0 },
];

export default function CellSelectionFillHandle() {
  const [rows, setRows] = React.useState(initialRows);

  const processRowUpdate = React.useCallback((newRow) => {
    setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        rowSelection={false}
        cellSelection
        cellSelectionFillHandle
        processRowUpdate={processRowUpdate}
      />
    </div>
  );
}
