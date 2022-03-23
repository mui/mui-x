import * as React from 'react';
import {
  DataGrid,
  GridColumns,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const CorrectRenderLink = (params: GridRenderCellParams) => (
  <Box>
    <Link tabIndex={params.hasFocus ? 0 : -1} href="/#">
      more info
    </Link>
  </Box>
);
const WrongRenderLink = () => (
  <Box>
    <Link href="/#">more info</Link>
  </Box>
);

const correctColumns: GridColumns = [
  { field: 'link', renderCell: CorrectRenderLink, width: 200 },
];
const wrongColumns: GridColumns = [
  { field: 'link', renderCell: WrongRenderLink, width: 200 },
];

const rows: GridRowsProp = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export default function FocusManagement() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <p>Correct focus management</p>
        <div style={{ height: 300 }}>
          <DataGrid rows={rows} columns={correctColumns} />
        </div>
      </div>
      <div>
        <p>Without focus management</p>
        <div style={{ height: 300 }}>
          <DataGrid rows={rows} columns={wrongColumns} />
        </div>
      </div>
    </div>
  );
}
