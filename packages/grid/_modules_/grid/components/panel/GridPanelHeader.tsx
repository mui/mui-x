import * as React from 'react';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { createTheme } from '../../utils/utils';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => ({
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
