import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ColumnOrderingGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 250, width: '100%' }}>
      <XGrid {...data} />
    </div>
  );
}
