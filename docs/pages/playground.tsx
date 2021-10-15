import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';

const groupingColDef = { minWidth: 400 };

export default function BasicTreeData() {
  const { data, loading } = useDemoTreeData({
    rowLength: [10, 10],
    randomLength: false,
  });

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        disableSelectionOnClick
        {...data}
        groupingColDef={groupingColDef}
        pagination
        pageSize={3}
        rowsPerPageOptions={[3]}
      />
    </div>
  );
}
