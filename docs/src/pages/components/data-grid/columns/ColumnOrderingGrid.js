import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ColumnOrderingGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid {...data} />
    </div>
  );
}
