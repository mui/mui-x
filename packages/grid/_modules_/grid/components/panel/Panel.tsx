import { makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { ApiContext } from '../api-context';
import { isMuiV5 } from '../../utils';

export interface PanelProps {
  children?: React.ReactNode;
  open: boolean;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      minWidth: 300,
      maxHeight: 450,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  }),
  { name: 'MuiDataGridPanel' },
);

export function Panel(props: PanelProps) {
  const classes = useStyles();
  const { children, open } = props;
  const apiRef = React.useContext(ApiContext);

  const getPopperModifiers = (): any => {
    if (isMuiV5()) {
      return [
        {
          name: 'flip',
          enabled: false,
        },
      ];
    }

    return {
      flip: {
        enabled: false,
      },
    };
  };

  const handleClickAway = React.useCallback(() => {
    apiRef!.current.hidePreferences();
  }, [apiRef]);

  let anchorEl;
  if (apiRef!.current && apiRef!.current.columnHeadersElementRef!.current) {
    anchorEl = apiRef?.current.columnHeadersElementRef!.current;
  }

  if (!anchorEl) {
    return null;
  }

  return (
    <Popper
      placement="bottom-start"
      open={open}
      anchorEl={anchorEl}
      modifiers={getPopperModifiers()}
      className={classes.root}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper className="MuiDataGrid-panel" elevation={8}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
