import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import useForkRef from '@mui/utils/useForkRef';
import { useGridPanelContext } from '../panel/GridPanelContext';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../../hooks';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../models';

export interface ColumnsPanelState {
  /**
   * If `true`, the columns panel is open.
   */
  open: boolean;
}

export type ColumnsPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], ColumnsPanelState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: ColumnsPanelState) => string);
};

/**
 * A button that opens and closes the columns panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Columns panel](https://mui.com/x/react-data-grid/components/columns-panel/)
 *
 * API:
 *
 * - [ColumnsPanelTrigger API](https://mui.com/x/api/data-grid/columns-panel-trigger/)
 */
const ColumnsPanelTrigger = forwardRef<HTMLButtonElement, ColumnsPanelTriggerProps>(
  function ColumnsPanelTrigger(props, ref) {
    const { render, className, onClick, onPointerUp, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.columns;
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const { columnsPanelTriggerRef } = useGridPanelContext();
    const handleRef = useForkRef(ref, columnsPanelTriggerRef);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, panelId, buttonId);
      }
      onClick?.(event);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (open) {
        event.stopPropagation();
      }
      onPointerUp?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        className: resolvedClassName,
        ...other,
        onPointerUp: handlePointerUp,
        onClick: handleClick,
        ref: handleRef,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ColumnsPanelTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  startIcon: PropTypes.node,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { ColumnsPanelTrigger };
