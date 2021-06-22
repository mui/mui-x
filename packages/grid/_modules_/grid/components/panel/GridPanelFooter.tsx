import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      padding: 4,
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
  { name: 'MuiGridPanelFooter' },
);

export function GridPanelFooter(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return <div className={clsx(classes.root, className)} {...other} />;
}
