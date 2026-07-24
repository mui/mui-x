import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  GRID_FORMULA_FUNCTIONS,
  GridFormulaFunctionDefinition,
} from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

// A custom function appears in the suggestion dropdown with the optional
// `signature`, `description` and `category` metadata it declares.
const MARGIN: GridFormulaFunctionDefinition = {
  name: 'MARGIN',
  minArgs: 2,
  maxArgs: 2,
  signature: 'MARGIN(revenue, cost)',
  description: 'Gross margin as a fraction of revenue.',
  category: 'Finance',
  apply: ([revenue, cost], context) => {
    const income = context.coerce.toNumber(revenue);
    const expense = context.coerce.toNumber(cost);
    if (typeof income !== 'number') {
      return income;
    }
    if (typeof expense !== 'number') {
      return expense;
    }
    return (income - expense) / income;
  },
};

const formulaFunctions = { ...GRID_FORMULA_FUNCTIONS, MARGIN };

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product', width: 190 },
  {
    field: 'revenue',
    headerName: 'Revenue',
    type: 'number',
    width: 120,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    type: 'number',
    width: 120,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  {
    field: 'margin',
    headerName: 'Gross margin',
    type: 'number',
    width: 170,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? percentFormatter.format(value) : value,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    product: 'Cloud subscription',
    revenue: 148000,
    cost: 31000,
    margin: '=MARGIN(revenue, cost)',
  },
  {
    id: 2,
    product: 'Enterprise support',
    revenue: 96500,
    cost: 54200,
    margin: '=MARGIN(revenue, cost)',
  },
  {
    id: 3,
    product: 'Implementation services',
    revenue: 72400,
    cost: 61800,
    margin: '=MARGIN(revenue, cost)',
  },
  {
    id: 4,
    product: 'Training workshops',
    revenue: 28900,
    cost: 16400,
    margin: '=MARGIN(revenue, cost)',
  },
  {
    id: 5,
    product: 'Hardware resale',
    revenue: 54100,
    cost: 47600,
    margin: '=MARGIN(revenue, cost)',
  },
  // The last margin is left empty on purpose: click it and type `=M` to see
  // the custom MARGIN function in the dropdown, with its signature help.
  {
    id: 6,
    product: 'Marketplace add-ons',
    revenue: 19700,
    cost: 8300,
  },
];

export default function FormulaAutocomplete() {
  return (
    <div style={{ height: 340, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaFunctions={formulaFunctions}
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
