import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const columns = [
  { field: 'region', headerName: 'Region', width: 140 },
  {
    field: 'revenue',
    headerName: 'Revenue',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'unitsSold',
    headerName: 'Units sold',
    type: 'number',
    width: 100,
    editable: true,
  },
];

const rows = [
  { id: 1, region: 'North America', revenue: 182400, unitsSold: 1520 },
  { id: 2, region: 'Europe', revenue: 143900, unitsSold: 1310 },
  { id: 3, region: 'Asia Pacific', revenue: 96500, unitsSold: 0 },
  { id: 4, region: 'Latin America', revenue: 41200, unitsSold: 380 },
  { id: 5, region: 'Middle East', revenue: 28700, unitsSold: null },
  { id: 6, region: 'Africa', revenue: 12300, unitsSold: 95 },
];

const computedColumns = [
  {
    field: 'unitPrice',
    headerName: 'Unit price',
    formula: '=revenue / unitsSold',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
  {
    field: 'unitPriceSafe',
    headerName: 'Unit price (safe)',
    formula: '=IFERROR(revenue / unitsSold, 0)',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
  {
    field: 'revenuePerStore',
    headerName: 'Revenue per store',
    // The `storeCount` column does not exist: the column is invalid.
    formula: '=revenue / storeCount',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
];

export default function ComputedColumnsErrors() {
  return (
    <div style={{ height: 420, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        columns={columns}
        computedColDef={{ width: 160 }}
        hideFooter
        initialState={{
          computedColumns: { model: computedColumns },
          sorting: { sortModel: [{ field: 'unitPrice', sort: 'desc' }] },
        }}
        showToolbar
        rowSelection={false}
        disablePivoting
      />
    </div>
  );
}
