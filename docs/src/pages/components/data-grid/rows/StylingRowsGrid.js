import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { makeStyles, lighten } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .super-app-theme--open': {
      backgroundColor: lighten(theme.palette.info.light, 0.6),
      '&:hover': {
        backgroundColor: lighten(theme.palette.info.light, 0.4),
      },
    },
    '& .super-app-theme--filled': {
      backgroundColor: lighten(theme.palette.success.light, 0.6),
      '&:hover': {
        backgroundColor: lighten(theme.palette.success.light, 0.4),
      },
    },
    '& .super-app-theme--partiallyfilled': {
      backgroundColor: lighten(theme.palette.warning.light, 0.6),
      '&:hover': {
        backgroundColor: lighten(theme.palette.warning.light, 0.4),
      },
    },
    '& .super-app-theme--rejected': {
      backgroundColor: lighten(theme.palette.error.light, 0.6),
      '&:hover': {
        backgroundColor: lighten(theme.palette.error.light, 0.4),
      },
    },
  },
}));

export default function StylingRowsGrid() {
  const classes = useStyles();

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <div style={{ height: 300, width: '100%' }} className={classes.root}>
      <DataGrid
        {...data}
        rowClassName={(params) =>
          `super-app-theme--${params.getValue('status').toLowerCase()}`
        }
      />
    </div>
  );
}
