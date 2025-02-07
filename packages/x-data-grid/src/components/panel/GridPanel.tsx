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
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { NotRendered } from '../../utils/assert';

type OwnerState = DataGridProcessedProps;

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  panel: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export interface GridPanelProps
  extends Pick<GridSlotProps['basePopper'], 'id' | 'className' | 'target'> {
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

const GridPanelRoot = styled(NotRendered<GridSlotProps['basePopper']>, {
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

const GridPanel = forwardRef<HTMLElement, GridPanelProps>((props, ref) => {
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

  const [target, setTarget] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector(
      '[data-id="gridPanelAnchor"]',
    );

    if (panelAnchor) {
      setTarget(panelAnchor);
    }
  }, [apiRef]);

  if (!target) {
    return null;
  }

  return (
    <GridPanelRoot
      as={rootProps.slots.basePopper}
      ownerState={rootProps}
      placement="bottom-start"
      className={clsx(classes.panel, className)}
      target={target}
      flip
      onDidMount={() => setIsPlaced(true)}
      onDidUnmount={() => setIsPlaced(false)}
      onClickAway={handleClickAway}
      clickAwayMouseEvent="onPointerUp"
      clickAwayTouchEvent={false}
      focusTrap
      focusTrapEnabled
      {...other}
      {...rootProps.slotProps?.basePopper}
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
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  clickAwayMouseEvent: PropTypes.oneOf([
    'onClick',
    'onMouseDown',
    'onMouseUp',
    'onPointerDown',
    'onPointerUp',
    false,
  ]),
  clickAwayTouchEvent: PropTypes.oneOf(['onTouchEnd', 'onTouchStart', false]),
  flip: PropTypes.bool,
  focusTrap: PropTypes.bool,
  focusTrapEnabled: PropTypes.bool,
  id: PropTypes.string,
  onClickAway: PropTypes.func,
  onDidMount: PropTypes.func,
  onDidUnmount: PropTypes.func,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
  ownerState: PropTypes.object,
  /**
   * @default 'bottom'
   */
  placement: PropTypes.oneOf([
    'auto-end',
    'auto-start',
    'auto',
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  target: PropTypes /* @typescript-to-proptypes-ignore */.any,
  transition: PropTypes.bool,
} as any;

export { GridPanel };
