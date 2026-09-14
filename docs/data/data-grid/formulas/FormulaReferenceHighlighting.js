import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const monthColumn = (field, headerName) => ({
  field,
  headerName,
  type: 'number',
  width: 110,
  allowFormulas: true,
  editable: true,
  valueFormatter: (value) =>
    typeof value === 'number' ? currencyFormatter.format(value) : value,
});

const columns = [
  { field: 'department', headerName: 'Department', width: 170 },
  monthColumn('jan', 'January'),
  monthColumn('feb', 'February'),
  monthColumn('mar', 'March'),
  {
    field: 'q1',
    headerName: 'Q1 total',
    type: 'number',
    width: 140,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

const rows = [
  {
    id: 1,
    department: 'Engineering',
    jan: 118000,
    feb: 122500,
    mar: 131000,
    // Three distinct references — each gets its own color while editing.
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
  {
    id: 4,
    department: 'Operations',
    jan: 42700,
    feb: 44300,
    mar: 43900,
    q1: '=jan + feb + mar',
  },
];

// Summary rows are pinned: a range window covers view positions of the data
// band, so a pinned total can never be swept into its own range by sorting.
const pinnedRows = {
  bottom: [
    // Row data stores the canonical syntax; the editor displays these windows
    // as `=SUM(B1:B4)`, `=SUM(E1:E4)`, and so on.
    {
      id: 5,
      department: 'All departments',
      jan: '=SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(1), COLUMN_TO(2), ROW_TO(4)))',
      feb: '=SUM(RANGE_REF(COLUMN_FROM(3), ROW_FROM(1), COLUMN_TO(3), ROW_TO(4)))',
      mar: '=SUM(RANGE_REF(COLUMN_FROM(4), ROW_FROM(1), COLUMN_TO(4), ROW_TO(4)))',
      q1: '=SUM(RANGE_REF(COLUMN_FROM(5), ROW_FROM(1), COLUMN_TO(5), ROW_TO(4)))',
    },
    // Three single-cell references into the pinned summary row: displays as
    // `=ROUND((B5 + C5 + D5) / 3 * 4, 0)`, each reference with its own color.
    {
      id: 6,
      department: 'Annual run rate',
      q1: '=ROUND((REF(COLUMN("jan"), ROW(5)) + REF(COLUMN("feb"), ROW(5)) + REF(COLUMN("mar"), ROW(5))) / 3 * 4, 0)',
    },
  ],
};

export default function FormulaReferenceHighlighting() {
  return (
    <div style={{ height: 340, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        pinnedRows={pinnedRows}
        columns={columns}
        formulaA1Notation
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
