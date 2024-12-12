/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../../../hooks';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridColumnsPanelTriggerState {
  /**
   * If `true`, the columns panel is open.
   */
  open: boolean;
}

export interface GridColumnsPanelTriggerProps extends Omit<ButtonProps, 'className'> {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridColumnsPanelTriggerState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: GridColumnsPanelTriggerState) => string);
}

/**
 * Demos:
 *
 * - [Columns Panel](https://mui.com/x/react-data-grid/components/columns-panel/)
 *
 * API:
 *
 * - [GridColumnsPanelTrigger API](https://mui.com/x/api/data-grid/grid-columns-panel-trigger/)
 */
const GridColumnsPanelTrigger = React.forwardRef<HTMLButtonElement, GridColumnsPanelTriggerProps>(
  function GridColumnsPanelTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.columns;
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const toggleColumnsPanel = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, panelId, buttonId);
      }

      onClick?.(event);
    };

    return useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref,
        id: buttonId,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        onClick: toggleColumnsPanel,
        className: resolvedClassName,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
      state,
    });
  },
);

GridColumnsPanelTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridColumnsPanelTrigger };
