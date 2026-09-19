import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const columns = [
  { field: 'product', headerName: 'Product', width: 180 },
  { field: 'category', headerName: 'Category', width: 120 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'discount',
    headerName: 'Discount %',
    type: 'number',
    width: 110,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    product: 'Laptop workstation',
    category: 'Hardware',
    price: 1650,
    cost: 1210,
    quantity: 4,
    discount: 0,
  },
  {
    id: 2,
    product: 'Ultrawide monitor',
    category: 'Hardware',
    price: 420,
    cost: 305,
    quantity: 8,
    discount: 10,
  },
  {
    id: 3,
    product: 'Docking station',
    category: 'Accessories',
    price: 185,
    cost: 122,
    quantity: 8,
    discount: 0,
  },
  {
    id: 4,
    product: 'Mechanical keyboard',
    category: 'Accessories',
    price: 95,
    cost: 48,
    quantity: 8,
    discount: 5,
  },
  {
    id: 5,
    product: 'Wireless mouse',
    category: 'Accessories',
    price: 45,
    cost: 19,
    quantity: 8,
    discount: 5,
  },
  {
    id: 6,
    product: 'Thunderbolt cable',
    category: 'Accessories',
    price: 29,
    cost: 9,
    quantity: 12,
    discount: 0,
  },
  {
    id: 7,
    product: 'On-site setup (hours)',
    category: 'Services',
    price: 120,
    cost: 75,
    quantity: 6,
    discount: 0,
  },
  {
    id: 8,
    product: 'Extended warranty',
    category: 'Services',
    price: 210,
    cost: 40,
    quantity: 4,
    discount: 15,
  },
];

const computedColumns = [
  {
    field: 'total',
    headerName: 'Total',
    formula: '=ROUND(price * quantity * (1 - discount / 100), 2)',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
    description: 'Line total after discount',
  },
  {
    field: 'margin',
    headerName: 'Margin',
    formula: '=(price - cost) / price',
    type: 'number',
    numberFormat: { style: 'percent', maximumFractionDigits: 1 },
  },
];

export default function ComputedColumnsBasic() {
  return (
    <div style={{ height: 420, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        columns={columns}
        initialState={{ computedColumns: { model: computedColumns } }}
        showToolbar
        rowSelection={false}
        disablePivoting
      />
    </div>
  );
}
