import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function TreeDataFullExample() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 10 },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro loading={loading} {...data} />
    </div>
  );
}
