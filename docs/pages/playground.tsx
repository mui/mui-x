import * as React from 'react';
import { DataGridPro, GridColumns, GridRowsProp } from '@mui/x-data-grid-pro';

const rows: GridRowsProp = [
  { id: 0, path: ['A'] },
  { id: 1, path: ['A', 'A', 'A', 'A'] },
  { id: 2, path: ['A', 'A', 'A', 'B'] },
  { id: 3, path: ['B'] },
  { id: 4, path: ['C', 'A', 'A'] },
];

const columns: GridColumns = [
  { field: 'id', type: 'number' },
  { field: 'path', renderCell: (params) => (params.value as string[]).join('-') },
];

const getTreeDataPath = (row: any) => row.path;

export default function FillerTreeData() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        treeData
        disableSelectionOnClick
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        filterModel={{ items: [{ columnField: 'id', operatorValue: '!=', value: 0 }] }}
        defaultGroupingExpansionDepth={1}
      />
    </div>
  );
}
