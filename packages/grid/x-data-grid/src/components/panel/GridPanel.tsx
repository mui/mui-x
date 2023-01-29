import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MUIStyledCommonProps } from '@mui/system';
import { styled, Theme } from '@mui/material/styles';
import { generateUtilityClasses, InternalStandardProps as StandardProps } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  panel: string;
  /** Styles applied to the paper element. */
  paper: string;
}

type OwnerState = DataGridProcessedProps;

export interface GridPanelProps
  extends StandardProps<MUIStyledCommonProps<Theme> & PopperProps, 'children'> {
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridPanelClasses>;
  open: boolean;
}

export const gridPanelClasses = generateUtilityClasses<keyof GridPanelClasses>('MuiDataGrid', [
  'panel',
  'paper',
]);

const GridPanelRoot = styled(Popper, {
  name: 'MuiDataGrid',
  slot: 'Panel',
  overridesResolver: (props, styles) => styles.panel,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const GridPaperRoot = styled(Paper, {
  name: 'MuiDataGrid',
  slot: 'Paper',
  overridesResolver: (props, styles) => styles.paper,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minWidth: 300,
  maxHeight: 450,
  display: 'flex',
}));

const GridPanel = React.forwardRef<HTMLDivElement, GridPanelProps>((props, ref) => {
  const { children, className, classes: classesProp, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = gridPanelClasses;
  const [isPlaced, setIsPlaced] = React.useState(false);

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

  const modifiers = React.useMemo(
    () => [
      {
        name: 'flip',
        enabled: false,
      },
      {
        name: 'isPlaced',
        enabled: true,
        phase: 'main' as const,
        fn: () => {
          setIsPlaced(true);
        },
        effect: () => () => {
          setIsPlaced(false);
        },
      },
    ],
    [],
  );

  const anchorEl = apiRef.current.columnHeadersContainerElementRef?.current;

  if (!anchorEl) {
    return null;
  }

  return (
    <GridPanelRoot
      ref={ref}
      placement="bottom-start"
      className={clsx(className, classes.panel)}
      ownerState={rootProps}
      anchorEl={anchorEl}
      modifiers={modifiers}
      {...other}
    >
      <ClickAwayListener mouseEvent="onMouseUp" onClickAway={handleClickAway}>
        <GridPaperRoot
          className={classes.paper}
          ownerState={rootProps}
          elevation={8}
          onKeyDown={handleKeyDown}
        >
          {isPlaced && children}
        </GridPaperRoot>
      </ClickAwayListener>
    </GridPanelRoot>
  );
});

GridPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool.isRequired,
} as any;

export { GridPanel };
