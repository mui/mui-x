import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';

export default function BasicTreeData() {
  const { data, loading } = useDemoTreeData({ rowLength: [20, 20], randomLength: false });

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        disableSelectionOnClick
        defaultGroupingExpansionDepth={1}
        sortModel={[{ field: 'index', sort: 'desc' }]}
        {...data}
      />
    </div>
  );
}
