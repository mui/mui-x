import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function TreeDataReordering() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 2 },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro loading={loading} rowReordering {...data} />
    </div>
  );
}
