import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  GridRowModel,
  unstable_useGridPivoting,
} from '@mui/x-data-grid-premium';
import { unstable_useId as useId } from '@mui/utils';

const initialRows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const initialColumns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  { field: 'price' },
  { field: 'quantity' },
];

export default function GridPivotingBasic() {
  const apiRef = useGridApiRef();

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel: {
      rows: ['type'],
      columns: [],
      values: [{ field: 'price', aggFunc: 'sum' }],
    },
  });

  const inputId = useId();

  return (
    <div style={{ width: '100%' }}>
      <input
        id={inputId}
        type="checkbox"
        checked={isPivot}
        onChange={(e) => setIsPivot(e.target.checked)}
      />
      <label htmlFor={inputId}>Pivot</label>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          key={isPivot.toString()}
          {...props}
          apiRef={apiRef}
          experimentalFeatures={{ columnGrouping: true }}
        />
      </div>
    </div>
  );
}
