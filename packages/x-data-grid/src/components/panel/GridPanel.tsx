import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import Paper from '@mui/material/Paper';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridBaseSlots } from '../../models/gridSlotsComponent';

type OwnerState = DataGridProcessedProps;

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  panel: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export interface GridPanelProps
  extends Partial<Omit<React.ComponentProps<typeof GridPanelRoot>, 'ref'>> {
  ref?: React.Ref<HTMLElement>;
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

const GridPanelRoot = styled('div' as unknown as GridBaseSlots['basePopper'], {
  name: 'MuiDataGrid',
  slot: 'Panel',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const GridPaperRoot = styled(Paper, {
  name: 'MuiDataGrid',
  slot: 'Paper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  minWidth: 300,
  maxHeight: 450,
  display: 'flex',
  maxWidth: `calc(100vw - ${theme.spacing(0.5)})`,
  overflow: 'auto',
}));

const GridPanel = forwardRef<HTMLDivElement, GridPanelProps>((props, ref) => {
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
      if (event.key === 'Escape') {
        apiRef.current.hidePreferences();
      }
    },
    [apiRef],
  );

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector(
      '[data-id="gridPanelAnchor"]',
    );

    if (panelAnchor) {
      setAnchorEl(panelAnchor);
    }
  }, [apiRef]);

  if (!anchorEl) {
    return null;
  }

  return (
    <GridPanelRoot
      as={rootProps.slots.basePopper}
      ownerState={rootProps}
      placement="bottom-start"
      className={clsx(classes.panel, className)}
      target={anchorEl}
      flip
      onDidMount={() => setIsPlaced(true)}
      onDidUnmount={() => setIsPlaced(false)}
      onClickAway={handleClickAway}
      clickAwayMouseEvent="onPointerUp"
      clickAwayTouchEvent={false}
      {...other}
      ref={ref}
    >
      <GridPaperRoot
        className={classes.paper}
        ownerState={rootProps}
        elevation={8}
        onKeyDown={handleKeyDown}
      >
        {isPlaced && children}
      </GridPaperRoot>
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
