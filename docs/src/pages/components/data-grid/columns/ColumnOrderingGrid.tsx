import * as React from 'react';
import { XGrid } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnOrderingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid {...data} />
    </div>
  );
}
