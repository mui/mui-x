import * as React from 'react';
import clsx from 'clsx';
import TrapFocus from '@material-ui/core/Unstable_TrapFocus';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      '&:focus': {
        outline: 0,
      },
    },
  }),
  { name: 'MuiGridPanelWrapper' },
);

const isEnabled = () => true;

export function GridPanelWrapper(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;

  return (
    <TrapFocus open disableEnforceFocus isEnabled={isEnabled}>
      <div tabIndex={-1} className={clsx(classes.root, className)} {...other} />
    </TrapFocus>
  );
}
