import * as React from 'react';
import { GridColumns, DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/styles';

const columns: GridColumns = [
  {
    field: 'first',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    width: 140,
  },
  {
    field: 'last',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    width: 140,
  },
];

const rows = [
  {
    id: 1,
    first: 'Jane',
    last: 'Carter',
  },
  {
    id: 2,
    first: 'Jack',
    last: 'Smith',
  },
  {
    id: 3,
    first: 'Gill',
    last: 'Martin',
  },
];

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});

export default function StylingHeaderGrid() {
  const classes = useStyles();

  return (
    <div style={{ height: 300, width: '100%' }} className={classes.root}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
