import { useDemoData } from '@mui/x-data-grid-generator';
import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';

const VISIBLE_FIELDS = ['quantity', 'filledQuantity', 'totalPrice'];

export default function RowGroupingFullExample() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 25,
    visibleFields: VISIBLE_FIELDS,
  });

  const apiRef = useGridApiRef();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        loading={loading}
        disableSelectionOnClick
        aggregationPosition="inline"
        initialState={{
          ...data.initialState,
          rowGrouping: {
            model: ['commodity'],
          },
          aggregation: {
            model: {
              quantity: { method: 'sum' },
              filledQuantity: { method: 'size' },
              totalPrice: { method: 'max' },
            },
          },
        }}
        experimentalFeatures={{
          rowGrouping: true,
          aggregation: true,
        }}
      />
    </div>
  );
}
