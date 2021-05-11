import * as React from 'react';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { classnames } from '../../utils/classnames';

const defaultTheme = createMuiTheme();
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
  return <div className={classnames(classes.root, className)} {...other} />;
}
