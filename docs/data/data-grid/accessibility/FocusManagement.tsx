import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function CorrectRenderLink(props: GridRenderCellParams) {
  return (
    <Link tabIndex={props.tabIndex} href="/#tab-sequence">
      more info
    </Link>
  );
}

function WrongRenderLink() {
  return <Link href="/#tab-sequence">more info</Link>;
}

const correctColumns: GridColDef[] = [
  { field: 'link', renderCell: CorrectRenderLink, width: 200 },
];
const wrongColumns: GridColDef[] = [
  { field: 'link', renderCell: WrongRenderLink, width: 200 },
];

const rows: GridRowsProp = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export default function FocusManagement() {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2">Without focus management</Typography>
        <Box sx={{ height: 300 }}>
          <DataGrid rows={rows} columns={wrongColumns} hideFooterSelectedRowCount />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2">Correct focus management</Typography>
        <Box sx={{ height: 300 }}>
          <DataGrid
            rows={rows}
            columns={correctColumns}
            hideFooterSelectedRowCount
          />
        </Box>
      </Grid>
    </Grid>
  );
}
