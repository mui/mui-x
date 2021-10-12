import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';

export default function DefaultGroupingExpansionDepthTreeData() {
  const { data, loading } = useDemoTreeData({
    rowLength: [10, 5, 3],
    randomLength: true,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        disableSelectionOnClick
        defaultGroupingExpansionDepth={1}
        {...data}
      />
    </div>
  );
}
