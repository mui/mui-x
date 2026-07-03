import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns: GridColDef[] = [
  { field: 'lender', headerName: 'Lender', width: 180 },
  {
    field: 'principal',
    headerName: 'Principal',
    type: 'number',
    width: 120,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  {
    field: 'apr',
    headerName: 'APR %',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'years',
    headerName: 'Years',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'payment',
    headerName: 'Monthly payment',
    type: 'number',
    width: 170,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

// Standard amortized-loan payment: P * r / (1 - (1 + r)^(-n)) with a monthly
// rate. After exporting, change an APR in Excel — the payment and the best
// offer recalculate there, because the cells hold live formulas.
const monthlyPayment =
  '=ROUND(principal * (apr / 1200) / (1 - POWER(1 + apr / 1200, -12 * years)), 2)';

const rows: GridRowsProp = [
  {
    id: 1,
    lender: 'First National Bank',
    principal: 420000,
    apr: 6.1,
    years: 30,
    payment: monthlyPayment,
  },
  {
    id: 2,
    lender: 'Harbor Credit Union',
    principal: 420000,
    apr: 5.8,
    years: 30,
    payment: monthlyPayment,
  },
  {
    id: 3,
    lender: 'Summit Online Lending',
    principal: 420000,
    apr: 6.4,
    years: 15,
    payment: monthlyPayment,
  },
  {
    id: 4,
    lender: 'Pacific Mortgage Co.',
    principal: 420000,
    apr: 5.95,
    years: 20,
    payment: monthlyPayment,
  },
  {
    id: 5,
    lender: 'Best offer',
    payment:
      '=MIN(RANGE(REF(COLUMN("payment"), ROW(1)), REF(COLUMN("payment"), ROW(4))))',
  },
];

export default function FormulaExcelExport() {
  return (
    <div style={{ height: 340, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaA1Notation
        rowSelection={false}
        density="compact"
        showToolbar
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
        slotProps={{
          toolbar: {
            excelOptions: {
              escapeFormulas: false,
            },
          },
        }}
      />
    </div>
  );
}
