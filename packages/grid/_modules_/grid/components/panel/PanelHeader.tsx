import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { classnames } from '../../utils/classnames';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1),
    },
  }),
  { name: 'MuiDataGridPanelHeader' },
);

export function PanelHeader(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={classnames(classes.root, className)} {...other} />;
}
