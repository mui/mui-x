import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
  Unstable_GridPivotModelEditor as GridPivotModelEditor,
} from '@mui/x-data-grid-premium';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const initialRows = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const initialColumns = [
  { field: 'product' },
  { field: 'type' },
  { field: 'price' },
  { field: 'quantity' },
];

export default function GridPivotingMultipleValues() {
  const apiRef = useGridApiRef();

  const [pivotModel, setPivotModel] = React.useState({
    rows: ['type'],
    columns: ['product'],
    values: [
      { field: 'price', aggFunc: 'sum' },
      { field: 'quantity', aggFunc: 'avg' },
    ],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel,
    apiRef,
  });

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch checked={isPivot} onChange={(e) => setIsPivot(e.target.checked)} />
        }
        label="Pivot"
      />
      {isPivot && (
        <GridPivotModelEditor
          columns={initialColumns}
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
        />
      )}

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
