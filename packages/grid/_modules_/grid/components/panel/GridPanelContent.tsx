import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      flex: '1 1',
      maxHeight: 400,
    },
  }),
  { name: 'MuiDataGridPanelContent' },
);

export function GridPanelContent(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={clsx(classes.root, className)} {...other} />;
}
