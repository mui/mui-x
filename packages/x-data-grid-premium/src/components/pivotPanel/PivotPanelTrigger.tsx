import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridComponentRenderer, RenderProp } from '@mui/x-data-grid-pro/internals';
import { GridSlotProps, useGridSelector } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridPivotPanelOpenSelector,
  gridPivotActiveSelector,
} from '../../hooks/features/pivoting/gridPivotingSelectors';

export interface PivotPanelState {
  /**
   * If `true`, the pivot panel is open.
   */
  open: boolean;
  /**
   * If `true`, pivot is active.
   */
  active: boolean;
}

export type PivotPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], PivotPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: PivotPanelState) => string);
};

/**
 * A button that opens and closes the pivot panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Pivot Panel](https://mui.com/x/react-data-grid/components/pivot-panel/)
 *
 * API:
 *
 * - [PivotPanelTrigger API](https://mui.com/x/api/data-grid/pivot-panel-trigger/)
 */
const PivotPanelTrigger = forwardRef<HTMLButtonElement, PivotPanelTriggerProps>(
  function PivotPanelTrigger(props, ref) {
    const { render, className, onClick, onPointerUp, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const open = useGridSelector(apiRef, gridPivotPanelOpenSelector);
    const active = useGridSelector(apiRef, gridPivotActiveSelector);
    const state = { open, active };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.setPivotPanelOpen(!open);
      onClick?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        // TODO: Hook up the panel/trigger IDs to the pivot panel
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        onClick: handleClick,
        className: resolvedClassName,
        ...other,
        ref,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

PivotPanelTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
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

export { PivotPanelTrigger };
