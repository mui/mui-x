import * as React from 'react';
import { DataGrid, getThemePaletteMode } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { makeStyles, darken, lighten } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = (color) =>
    getThemePaletteMode(theme.palette) === 'dark'
      ? darken(color, 0.6)
      : lighten(color, 0.6);

  const getHoverBackgroundColor = (color) =>
    getThemePaletteMode(theme.palette) === 'dark'
      ? darken(color, 0.5)
      : lighten(color, 0.5);

  return {
    root: {
      '& .super-app-theme--Open': {
        backgroundColor: getBackgroundColor(theme.palette.info.main),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(theme.palette.info.main),
        },
      },
      '& .super-app-theme--Filled': {
        backgroundColor: getBackgroundColor(theme.palette.success.main),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(theme.palette.success.main),
        },
      },
      '& .super-app-theme--PartiallyFilled': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(theme.palette.warning.main),
        },
      },
      '& .super-app-theme--Rejected': {
        backgroundColor: getBackgroundColor(theme.palette.error.main),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
        },
      },
    },
  };
});

export default function StylingRowsGrid() {
  const classes = useStyles();

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }} className={classes.root}>
      <DataGrid
        {...data}
        getRowClassName={(params) => `super-app-theme--${params.getValue('status')}`}
      />
    </div>
  );
}
