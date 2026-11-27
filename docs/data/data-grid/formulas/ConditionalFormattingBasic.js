import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const columns = [
  { field: 'product', headerName: 'Product', width: 180 },
  { field: 'status', headerName: 'Status', width: 130, editable: true },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    editable: true,
  },
  { field: 'cost', headerName: 'Cost', type: 'number', width: 100, editable: true },
  { field: 'stock', headerName: 'Stock', type: 'number', width: 90, editable: true },
];

const rows = [
  {
    id: 1,
    product: 'Laptop workstation',
    status: 'Active',
    price: 1650,
    cost: 1210,
    stock: 4,
  },
  {
    id: 2,
    product: 'Ultrawide monitor',
    status: 'Active',
    price: 420,
    cost: 305,
    stock: 18,
  },
  {
    id: 3,
    product: 'Docking station',
    status: 'Discontinued',
    price: 185,
    cost: 122,
    stock: 2,
  },
  {
    id: 4,
    product: 'Mechanical keyboard',
    status: 'Active',
    price: 129,
    cost: 48,
    stock: 35,
  },
  {
    id: 5,
    product: 'Wireless mouse',
    status: 'Active',
    price: 59,
    cost: 21,
    stock: 7,
  },
  {
    id: 6,
    product: 'USB-C hub',
    status: 'Discontinued',
    price: 49,
    cost: 30,
    stock: 12,
  },
];

const conditionalFormatting = [
  {
    type: 'highlight',
    fields: ['stock'],
    condition: { type: 'cell', operator: 'lessThan', value: 10 },
    style: { color: '#e53935', fontWeight: 'bold' },
  },
  {
    type: 'highlight',
    fields: ['product', 'status'],
    condition: { type: 'formula', formula: '=status = "Discontinued"' },
    style: { textDecoration: 'line-through' },
  },
  {
    type: 'highlight',
    fields: ['product', 'price'],
    condition: { type: 'formula', formula: '=price > cost * 2' },
    style: { backgroundColor: '#c8e6c9' },
  },
];

export default function ConditionalFormattingBasic() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        columns={columns}
        conditionalFormatting={conditionalFormatting}
        showToolbar
        rowSelection={false}
        disablePivoting
      />
    </div>
  );
}
