import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function BasicTreeData() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    maxColumns: 6,
    treeData: {
      depth: 3,
      averageChildren: 10,
      groupingField: 'name',
    },
  });

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGridPro loading={loading} disableSelectionOnClick {...data} />
    </div>
  );
}
