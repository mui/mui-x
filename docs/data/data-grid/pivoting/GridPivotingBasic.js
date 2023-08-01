import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
} from '@mui/x-data-grid-premium';

const initialRows = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20 },
];

const initialColumns = [{ field: 'product' }, { field: 'type' }, { field: 'price' }];

export default function GridPivotingBasic() {
  const apiRef = useGridApiRef();

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel: {
      rows: ['type'],
      columns: ['product'],
      value: 'price',
      aggFunc: 'sum',
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <input
        id="pivot"
        type="checkbox"
        checked={isPivot}
        onChange={(e) => setIsPivot(e.target.checked)}
      />
      <label htmlFor="pivot">Pivot</label>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium key={isPivot.toString()} {...props} apiRef={apiRef} />
      </div>
    </div>
  );
}
