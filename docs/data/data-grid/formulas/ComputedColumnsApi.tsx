import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product', width: 180 },
  { field: 'price', headerName: 'Price', type: 'number', width: 100 },
  { field: 'cost', headerName: 'Cost', type: 'number', width: 100 },
  { field: 'quantity', headerName: 'Qty', type: 'number', width: 80 },
];

const rows: GridRowsProp = [
  { id: 1, product: 'Laptop workstation', price: 1650, cost: 1210, quantity: 4 },
  { id: 2, product: 'Ultrawide monitor', price: 420, cost: 305, quantity: 8 },
  { id: 3, product: 'Docking station', price: 185, cost: 122, quantity: 8 },
  { id: 4, product: 'Mechanical keyboard', price: 95, cost: 48, quantity: 8 },
  { id: 5, product: 'Wireless mouse', price: 45, cost: 19, quantity: 8 },
  { id: 6, product: 'Thunderbolt cable', price: 29, cost: 9, quantity: 12 },
];

const marginColumn: GridComputedColumnDefinition = {
  field: 'margin',
  headerName: 'Margin',
  formula: '=(price - cost) / price',
  type: 'number',
  numberFormat: { style: 'percent', maximumFractionDigits: 1 },
};

const totalColumn: GridComputedColumnDefinition = {
  field: 'total',
  headerName: 'Total',
  formula: '=price * quantity',
  type: 'number',
  numberFormat: { style: 'currency', currency: 'USD' },
};

export default function ComputedColumnsApi() {
  const apiRef = useGridApiRef();
  const [computedColumns, setComputedColumns] =
    React.useState<GridComputedColumnsModel>([]);
  const hasMargin = computedColumns.some((column) => column.field === 'margin');
  const hasTotal = computedColumns.some((column) => column.field === 'total');

  const addMargin = () => {
    // Insert the column right after the `cost` column.
    apiRef.current?.addComputedColumn(marginColumn, { columnIndex: 3 });
  };

  const addTotal = () => {
    apiRef.current?.addComputedColumn(totalColumn);
  };

  const roundMargin = () => {
    apiRef.current?.updateComputedColumn('margin', {
      formula: '=ROUND((price - cost) / price, 1)',
      headerName: 'Margin (rounded)',
    });
  };

  const editTotal = () => {
    apiRef.current?.showComputedColumnEditor('total', { sampleRowId: 2 });
  };

  const removeAll = () => {
    apiRef.current?.setComputedColumns([]);
  };

  return (
    <div style={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
        <Button size="small" onClick={addMargin} disabled={hasMargin}>
          Add margin
        </Button>
        <Button size="small" onClick={roundMargin} disabled={!hasMargin}>
          Round margin
        </Button>
        <Button size="small" onClick={addTotal} disabled={hasTotal}>
          Add total
        </Button>
        <Button size="small" onClick={editTotal} disabled={!hasTotal}>
          Edit total in the panel
        </Button>
        <Button
          size="small"
          onClick={removeAll}
          disabled={computedColumns.length === 0}
        >
          Remove all
        </Button>
      </Stack>
      <div style={{ height: 360 }}>
        <DataGridPremium
          apiRef={apiRef}
          featureDependencies={{ formula: formulaFeature }}
          rows={rows}
          columns={columns}
          onComputedColumnsChange={setComputedColumns}
          rowSelection={false}
          disablePivoting
        />
      </div>
    </div>
  );
}
