import * as React from 'react';
import { DataGridPro, GridColumns, GridRowsProp } from '@mui/x-data-grid-pro';

const rows: GridRowsProp = [
    { path: ['A'] },
    { path: ['A', 'A', 'A', 'A'] },
    { path: ['A', 'A', 'A', 'B'] },
    { path: ['B'] },
    { path: ['C', 'A', 'A'] },
];

const columns: GridColumns = [
    { field: 'path', renderCell: (params) => (params.value as string[]).join('-') },
];

const getTreeDataPath = (row: any) => row.path;

const getRowId = (row: any) => row.path.join('-');

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
