import * as React from 'react';
import clsx from 'clsx';
import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(1),
    },
  }),
  { name: 'MuiDataGridPanelHeader', defaultTheme }, // TODO rename to MuiGridPanelHeader
);

export function GridPanelHeader(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={clsx(classes.root, className)} {...other} />;
}
