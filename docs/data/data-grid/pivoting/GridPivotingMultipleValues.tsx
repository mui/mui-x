import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  GridRowModel,
  unstable_useGridPivoting,
  GridPivotModel,
} from '@mui/x-data-grid-premium';

const initialRows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const initialColumns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  {
    field: 'price',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  { field: 'quantity' },
];

export default function GridPivotingMultipleValues() {
  const apiRef = useGridApiRef();

  const [pivotModel, setPivotModel] = React.useState<GridPivotModel>({
    rows: [{ field: 'type' }],
    columns: [{ field: 'product' }],
    values: [
      { field: 'price', aggFunc: 'sum' },
      { field: 'quantity', aggFunc: 'avg' },
    ],
  });

  const [isPivotMode, setIsPivotMode] = React.useState(false);

  const pivotParams = unstable_useGridPivoting({
    apiRef,
    pivotModel,
    onPivotModelChange: setPivotModel,
    pivotMode: isPivotMode,
    onPivotModeChange: setIsPivotMode,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={initialRows}
        columns={initialColumns}
        pivotParams={pivotParams}
        apiRef={apiRef}
        columnGroupHeaderHeight={36}
      />
    </div>
  );
}
