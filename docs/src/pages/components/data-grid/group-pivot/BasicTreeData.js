import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default function BasicTreeData() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        treeData
        getTreeDataPath={(row) => row.name.split('.')}
        getRowId={(row) => row.name}
        disableSelectionOnClick
      />
    </div>
  );
}

const columns = [{ field: 'name', headerName: 'Name' }];

const rows = [
  { name: 'A' },
  { name: 'A.A' },
  { name: 'B' },
  { name: 'B.A' },
  { name: 'B.B' },
  { name: 'B.B.A' },
  { name: 'C' },
  { name: 'D' },
  { name: 'D.A' },
  { name: 'D.B' },
  { name: 'D.C' },
  { name: 'D.D' },
  { name: 'D.E' },
  { name: 'D.F' },
  { name: 'D.G' },
  { name: 'D.H' },
  { name: 'D.I' },
  { name: 'D.J' },
  { name: 'D.K' },
  { name: 'E' },
  { name: 'F' },
  { name: 'F.A' },
  { name: 'F.A.A' },
  { name: 'F.A.B' },
  { name: 'F.A.C' },
  { name: 'F.A.D' },
  { name: 'F.A.E' },
  { name: 'G' },
  { name: 'H' },
  { name: 'I' },
  { name: 'J' },
];
