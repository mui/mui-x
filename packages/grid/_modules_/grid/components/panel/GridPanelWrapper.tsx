import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { classnames } from '../../utils/classnames';

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  }),
  { name: 'MuiDataGridPanelWrapper' },
);

export function GridPanelWrapper(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={classnames(classes.root, className)} {...other} />;
}
