import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { GridApiContext } from '../GridApiContext';
import { isMuiV5 } from '../../utils';

export interface GridPanelProps extends React.HTMLAttributes<HTMLDivElement> {
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

export const GridPanel = React.forwardRef<HTMLDivElement, GridPanelProps>(function GridPanel(
  props,
  ref,
) {
  const { children, open, className, ...other } = props;
  const classes = useStyles();
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
      ref={ref}
      className={className}
      placement="bottom-start"
      open={open}
      anchorEl={anchorEl}
      modifiers={getPopperModifiers()}
      {...other}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper className={classes.root} elevation={8} onKeyDown={handleKeyDown}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
});
