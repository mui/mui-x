import * as React from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { createTheme } from '../../utils/utils';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1),
    },
  }),
  { name: 'MuiDataGridPanelHeader', defaultTheme },
);

export function GridPanelHeader(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={clsx(classes.root, className)} {...other} />;
}
