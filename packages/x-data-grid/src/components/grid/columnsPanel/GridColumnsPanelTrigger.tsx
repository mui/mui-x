/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
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
import type { GridSlotProps } from '../../../models';

export interface GridColumnsPanelState {
  /**
   * If `true`, the columns panel is open.
   */
  open: boolean;
}

export type GridColumnsPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], GridColumnsPanelState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: GridColumnsPanelState) => string);
};

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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, panelId, buttonId);
      }

      onClick?.(event);
    };

    return useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        ref,
        id: buttonId,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        onClick: handleClick,
        className: resolvedClassName,
        ...other,
      },
      state,
    );
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
