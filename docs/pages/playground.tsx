import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';
import * as React from 'react';

export default function FlexLayoutGridSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 15,
    maxColumns: 6,
  });

  const tmpData = JSON.parse(JSON.stringify(data));
  tmpData.columns.forEach((item) => {
    item.flex = 1;
  });
  return (
    <div style={{ height: '400px', width: '400px' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGridPro
            autoHeight
            showCellRightBorder
            showColumnRightBorder
            disableExtendRowFullWidth
            rows={tmpData.rows}
            columns={tmpData.columns}
          />
        </div>
      </div>
    </div>
  );
}
