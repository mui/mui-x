import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { GridApiContext } from '../GridApiContext';
import { isMuiV5 } from '../../utils';

export interface GridPanelProps {
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
    },
  }),
  { name: 'MuiDataGridPanel' },
);

export function GridPanel(props: GridPanelProps) {
  const classes = useStyles();
  const { children, open } = props;
  const apiRef = React.useContext(GridApiContext);

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

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === 'Escape') {
        apiRef!.current.hidePreferences();
      }
    },
    [apiRef],
  );

  let anchorEl;
  if (apiRef!.current && apiRef!.current.columnHeadersElementRef?.current) {
    anchorEl = apiRef?.current.columnHeadersElementRef?.current;
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
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper className={classes.root} elevation={8} onKeyDown={handleKeyDown}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
