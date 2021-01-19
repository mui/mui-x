import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ApiContext } from '../api-context';
import { isMuiV5 } from '../../utils';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      minWidth: 300,
      maxHeight: 450,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      '& .MuiDataGridPanel-header': {
        padding: 8,
      },
      '& .MuiDataGridPanel-container': {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        flex: '1 1',
      },
      '& .MuiDataGridPanel-footer': {
        padding: 4,
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
  }),
  { name: 'MuiDataGridPanel' },
);

export interface PanelProps {
  children?: React.ReactNode;
  open: boolean;
}

export function Panel(props: PanelProps) {
  const { children, open } = props;
  const classes = useStyles();
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
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper className={classes.root} elevation={8}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
