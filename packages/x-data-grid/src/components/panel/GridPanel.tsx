import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = DataGridProcessedProps;

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  panel: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export interface GridPanelProps extends Partial<React.ComponentProps<typeof GridPanelRoot>> {
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
  backgroundColor: (theme.vars || theme).palette.background.paper,
  minWidth: 300,
  maxHeight: 450,
  display: 'flex',
  maxWidth: `calc(100vw - ${theme.spacing(0.5)})`,
  overflow: 'auto',
}));

const GridPanel = React.forwardRef<HTMLDivElement, GridPanelProps>((props, ref) => {
  const { children, className, classes: classesProp, anchorEl, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = gridPanelClasses;
  const [isPlaced, setIsPlaced] = React.useState(false);
  // const [isOpen, setIsOpen] = React.useState(props.open);

  const handleClickAway = React.useCallback(() => {
    apiRef.current.hidePreferences();
  }, [apiRef]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        apiRef.current.hidePreferences();
      }
    },
    [apiRef],
  );

  const modifiers = React.useMemo(
    () => [
      {
        name: 'flip',
        enabled: true,
        options: {
          rootBoundary: 'document',
        },
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

  const [fallbackAnchorEl, setFallbackAnchorEl] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector(
      '[data-id="gridPanelAnchor"]',
    );

    if (panelAnchor) {
      setFallbackAnchorEl(panelAnchor);
    }
  }, [apiRef]);

  if (!anchorEl && !fallbackAnchorEl) {
    return null;
  }

  return (
    <GridPanelRoot
      ref={ref}
      placement="bottom-start"
      className={clsx(className, classes.panel)}
      ownerState={rootProps}
      anchorEl={anchorEl ?? fallbackAnchorEl}
      modifiers={modifiers}
      transition
      {...other}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
          <Grow {...TransitionProps} timeout={350} style={{ transformOrigin: 'top right' }}>
            <GridPaperRoot
              className={classes.paper}
              ownerState={rootProps}
              elevation={8}
              onKeyDown={handleKeyDown}
            >
              {isPlaced && children}
            </GridPaperRoot>
          </Grow>
        </ClickAwayListener>
      )}
    </GridPanelRoot>
  );
});

GridPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Popper render function or node.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool.isRequired,
  ownerState: PropTypes.object,
} as any;

export { GridPanel };
