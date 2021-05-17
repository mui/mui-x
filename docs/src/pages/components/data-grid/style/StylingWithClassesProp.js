import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { makeStyles, lighten } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: lighten(theme.palette.info.main, 0.6),
  },
  columnHeader: {
    background: lighten(theme.palette.error.main, 0.6),
  },
  row: {
    background: lighten(theme.palette.success.main, 0.6),
  },
  cell: {
    fontWeight: 'bold',
  },
}));

export default function StylingWithClassesProp() {
  const classes = useStyles();

  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 50,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} classes={classes} />
    </div>
  );
}
