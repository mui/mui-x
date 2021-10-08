import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  { path: ['A'] },
  { path: ['A', 'A', 'A', 'A'] },
  { path: ['A', 'A', 'A', 'B'] },
  { path: ['B'] },
  { path: ['C', 'A', 'A'] },
];

const columns = [{ field: 'path', renderCell: (params) => params.value.join('-') }];

const getTreeDataPath = (row) => row.path;

const getRowId = (row) => row.path.join('-');

export default function FillerTreeData() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        treeData
        disableSelectionOnClick
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        getRowId={getRowId}
      />
    </div>
  );
}
