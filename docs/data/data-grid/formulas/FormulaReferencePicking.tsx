import * as React from 'react';
import type { GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const amountColumn = (
  field: string,
  headerName: string,
  width = 110,
): GridColDef => ({
  field,
  headerName,
  type: 'number',
  width,
  allowFormulas: true,
  editable: true,
  valueFormatter: (value) =>
    typeof value === 'number' ? currencyFormatter.format(value) : value,
});

const columns: GridColDef[] = [
  { field: 'department', headerName: 'Department', width: 170 },
  amountColumn('jan', 'January'),
  amountColumn('feb', 'February'),
  amountColumn('mar', 'March'),
  amountColumn('q1', 'Q1 total', 160),
];

const rows: GridRowsProp = [
  {
    id: 1,
    department: 'Engineering',
    jan: 118000,
    feb: 122500,
    mar: 131000,
    q1: '=jan + feb + mar',
  },
  {
    id: 2,
    department: 'Marketing',
    jan: 64200,
    feb: 58900,
    mar: 71400,
    q1: '=jan + feb + mar',
  },
  {
    id: 3,
    department: 'Sales',
    jan: 83500,
    feb: 90100,
    mar: 96800,
    q1: '=jan + feb + mar',
  },
  // The Q1 total of this row is left empty: build it by clicking the cells.
  {
    id: 4,
    department: 'Operations',
    jan: 42700,
    feb: 44300,
    mar: 43900,
  },
];

const pinnedRows = {
  bottom: [
    // Only January has its sum: build the other ones by dragging over the cells.
    {
      id: 5,
      department: 'All departments',
      // Row data stores the canonical syntax; the editor displays `=SUM(B1:B4)`.
      jan: '=SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(1), COLUMN_TO(2), ROW_TO(4)))',
    },
  ],
};

export default function FormulaReferencePicking() {
  return (
    <div style={{ height: 380, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        pinnedRows={pinnedRows}
        columns={columns}
        formulaReferencePicking
        formulaA1Notation
        showToolbar
        slotProps={{ toolbar: { formulaBar: true } }}
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
