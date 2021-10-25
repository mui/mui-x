import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
  });

  return (
    <div style={{ width: '100%', height: 600 }}>
      <DataGridPro {...data} />
    </div>
  );
};
