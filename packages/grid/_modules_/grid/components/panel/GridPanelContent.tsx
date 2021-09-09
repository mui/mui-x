import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

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
  { name: 'MuiGridPanelContent' },
);

export function GridPanelContent(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={clsx(classes.root, className)} {...other} />;
}
