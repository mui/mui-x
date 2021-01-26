import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { classnames } from '../../utils/classnames';

const useStyles = makeStyles(
  () => ({
    root: {
      padding: 4,
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
  { name: 'MuiDataGridPanelFooter' },
);

export function PanelFooter(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={classnames(classes.root, className)} {...other} />;
}
