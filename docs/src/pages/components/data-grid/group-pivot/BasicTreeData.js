import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  { path: ['Sarah'], jobTitle: 'CEO' },
  { path: ['Sarah', 'Thomas'], jobTitle: 'Head of Sales' },
  { path: ['Sarah', 'Thomas', 'Robert'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Thomas', 'Karen'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Thomas', 'Nancy'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Thomas', 'Daniel'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Thomas', 'Christopher'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Thomas', 'Donald'], jobTitle: 'Sales Person' },
  { path: ['Sarah', 'Mary'], jobTitle: 'Head of Engineering' },
  { path: ['Sarah', 'Mary', 'Jennifer'], jobTitle: 'Tech lead front' },
  { path: ['Sarah', 'Mary', 'Jennifer', 'Linda'], jobTitle: 'Front-end developer' },
  { path: ['Sarah', 'Mary', 'Michael'], jobTitle: 'Tech lead devops' },
  { path: ['Sarah', 'Mary', 'Linda'], jobTitle: 'Tech lead back' },
  { path: ['Sarah', 'Mary', 'Linda', 'Elizabeth'], jobTitle: 'Back-end developer' },
  { path: ['Sarah', 'Mary', 'Linda', 'William'], jobTitle: 'Back-end developer' },
];

const columns = [{ field: 'jobTitle', width: 250 }];

const getRowId = (row) => row.path.join('-');
const getTreeDataPath = (row) => row.path;

export default function BasicTreeData() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        treeData
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        getRowId={getRowId}
        getTreeDataPath={getTreeDataPath}
      />
    </div>
  );
}
