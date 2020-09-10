import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function XGridDemo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
  });

  return (
    <div style={{ width: '100%', height: 520 }}>
      <XGrid
        {...data}
        loading={data.rows.length === 0}
        rowHeight={38}
        checkboxSelection
      />
    </div>
  );
}
