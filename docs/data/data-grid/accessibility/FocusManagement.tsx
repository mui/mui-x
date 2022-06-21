import * as React from 'react';
import {
  DataGrid,
  GridColumns,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const CorrectRenderLink = (props: GridRenderCellParams) => (
  <Link tabIndex={props.tabIndex} href="/#tab-sequence">
    more info
  </Link>
);

const WrongRenderLink = () => <Link href="/#tab-sequence">more info</Link>;

const correctColumns: GridColumns = [
  { field: 'link', renderCell: CorrectRenderLink, width: 200 },
];
const wrongColumns: GridColumns = [
  { field: 'link', renderCell: WrongRenderLink, width: 200 },
];

const rows: GridRowsProp = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export default function FocusManagement() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Typography variant="body2">Without focus management</Typography>
        <Box sx={{ height: 300 }}>
          <DataGrid rows={rows} columns={wrongColumns} hideFooterSelectedRowCount />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
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
