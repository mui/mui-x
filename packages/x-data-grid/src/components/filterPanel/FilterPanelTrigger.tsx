import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import useForkRef from '@mui/utils/useForkRef';
import { useGridPanelContext } from '../panel/GridPanelContext';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import {
  gridFilterActiveItemsSelector,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../../hooks';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridSlotProps } from '../../models';

export interface FilterPanelState {
  /**
   * If `true`, the filter panel is open.
   */
  open: boolean;
  /**
   * The number of active filters.
   */
  filterCount: number;
}

export type FilterPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], FilterPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: FilterPanelState) => string);
};

/**
 * A button that opens and closes the filter panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Filter Panel](https://mui.com/x/react-data-grid/components/filter-panel/)
 *
 * API:
 *
 * - [FilterPanelTrigger API](https://mui.com/x/api/data-grid/filter-panel-trigger/)
 */
const FilterPanelTrigger = forwardRef<HTMLButtonElement, FilterPanelTriggerProps>(
  function FilterPanelTrigger(props, ref) {
    const { render, className, onClick, onPointerUp, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.filters;
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const filterCount = activeFilters.length;
    const state = { open, filterCount };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const { triggers } = useGridPanelContext();
    const handleRef = useForkRef(ref, triggers.filterPanel.setRef);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.filters, panelId, buttonId);
      }
      onClick?.(event);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (open) {
        event.stopPropagation();
      }
      onPointerUp?.(event);
    };

    const element = useComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        'aria-haspopup': 'dialog',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        onClick: handleClick,
        onPointerUp: handlePointerUp,
        className: resolvedClassName,
        ...other,
        ref: handleRef,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

FilterPanelTrigger.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * If `true`, the button is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * The id of the button element.
   */
  id: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The ARIA role of the button element.
   */
  role: PropTypes.string,
  /**
   * The size of the button.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /**
   * Element placed before the children.
   */
  startIcon: PropTypes.node,
  style: PropTypes.object,
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex: PropTypes.number,
  /**
   * The title of the button element.
   */
  title: PropTypes.string,
  /**
   * @ignore
   */
  touchRippleRef: PropTypes.any,
} as any;

export { FilterPanelTrigger };
