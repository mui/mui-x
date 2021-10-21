import * as React from 'react';
import clsx from 'clsx';
import { GridColumns, DataGrid, GridCellParams } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';

const columns: GridColumns = [
  {
    field: 'name',
    cellClassName: 'super-app-theme--cell',
  },
  {
    field: 'score',
    type: 'number',
    width: 140,
    cellClassName: (params: GridCellParams<number>) =>
      clsx('super-app', {
        negative: params.value < 0,
        positive: params.value > 0,
      }),
  },
];

const rows = [
  {
    id: 1,
    name: 'Jane',
    score: 100,
  },
  {
    id: 2,
    name: 'Jack',
    score: -100,
  },
  {
    id: 3,
    name: 'Gill',
    score: -50,
  },
];

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--cell': {
      backgroundColor: 'rgba(224, 183, 60, 0.55)',
      color: '#1a3e72',
      fontWeight: '600',
    },
    '& .super-app.negative': {
      backgroundColor: 'rgba(157, 255, 118, 0.49)',
      color: '#1a3e72',
      fontWeight: '600',
    },
    '& .super-app.positive': {
      backgroundColor: '#d47483',
      color: '#1a3e72',
      fontWeight: '600',
    },
  },
});

export default function StylingCellsGrid() {
  const classes = useStyles();

  return (
    <div style={{ height: 300, width: '100%' }} className={classes.root}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
