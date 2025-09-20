import * as React from 'react';
import { DataGridPro, GridRowModel } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function getTreeDataPath(row: GridRowModel) {
  return row.path;
}

function setTreeDataPath(path: readonly string[], row: GridRowModel) {
  return {
    ...row,
    path,
  };
}

export default function TreeDataReordering() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 2 },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rowReordering
        disableRowSelectionOnClick
        getTreeDataPath={getTreeDataPath}
        setTreeDataPath={setTreeDataPath}
      />
    </div>
  );
}
