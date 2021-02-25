import * as React from 'react';
import { Unstable_TrapFocus as TrapFocus } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { classnames } from '../../utils/classnames';

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
  { name: 'MuiDataGridPanelWrapper' },
);

export function GridPanelWrapper(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const classes = useStyles();
  const { className, ...other } = props;
  return (
    <TrapFocus open disableEnforceFocus isEnabled={() => true} getDoc={() => document}>
      <div tabIndex={-1} className={classnames(classes.root, className)} {...other} />
    </TrapFocus>
  );
}
