import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { getMuiVersion, createTheme } from '../../utils/utils';
import { isEscapeKey } from '../../utils/keyboardUtils';
import {
  InternalStandardProps as StandardProps,
  generateUtilityClasses,
} from '../../utils/material-ui-utils';

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export interface GridPanelProps extends StandardProps<PopperProps, 'children'> {
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridPanelClasses>;
  open: boolean;
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      zIndex: theme.zIndex.modal,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      minWidth: 300,
      maxHeight: 450,
      display: 'flex',
    },
  }),
  { name: 'MuiGridPanel', defaultTheme },
);

export const gridPanelClasses = generateUtilityClasses('MuiGridPanel', ['root', 'paper']);

const GridPanel = React.forwardRef<HTMLDivElement, GridPanelProps>((props, ref) => {
  const { children, className, open, ...other } = props;
  const classes = useStyles(other);
  const apiRef = useGridApiContext();

  const getPopperModifiers = (): any => {
    if (getMuiVersion() === 'v5') {
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
    apiRef.current.hidePreferences();
  }, [apiRef]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (isEscapeKey(event.key)) {
        apiRef.current.hidePreferences();
      }
    },
    [apiRef],
  );

  const anchorEl = apiRef.current.columnHeadersContainerElementRef?.current;

  if (!anchorEl) {
    return null;
  }

  return (
    <Popper
      ref={ref}
      placement="bottom-start"
      className={clsx(className, classes.root)}
      open={open}
      anchorEl={anchorEl}
      modifiers={getPopperModifiers()}
      {...other}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper className={classes.paper} elevation={8} onKeyDown={handleKeyDown}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
});

GridPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If `true`, the popper is visible.
   */
  open: PropTypes.bool.isRequired,
} as any;

export { GridPanel };
