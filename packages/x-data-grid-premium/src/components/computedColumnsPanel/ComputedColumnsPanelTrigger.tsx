import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useGridSelector } from '@mui/x-data-grid-pro';
import type { GridSlotProps } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridComputedColumnsPanelOpenSelector } from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import { GridSidebarValue } from '../../hooks/features/sidebar';

export interface ComputedColumnsPanelState {
  /**
   * If `true`, the computed columns panel is open.
   */
  open: boolean;
}

export type ComputedColumnsPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], ComputedColumnsPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: ComputedColumnsPanelState) => string);
};

/**
 * A button that opens and closes the computed columns panel.
 * It renders the `baseButton` slot.
 * It renders nothing when computed columns are not available (the formula feature
 * is missing, or `disableComputedColumns`, `disableFormulas` or `dataSource` is set).
 *
 * Demos:
 *
 * - [Computed Columns Panel](https://mui.com/x/react-data-grid/components/computed-columns-panel/)
 * - [Computed columns](https://mui.com/x/react-data-grid/computed-columns/)
 *
 * API:
 *
 * - [ComputedColumnsPanelTrigger API](https://mui.com/x/api/data-grid/computed-columns-panel-trigger/)
 */
const ComputedColumnsPanelTrigger = forwardRef<HTMLButtonElement, ComputedColumnsPanelTriggerProps>(
  function ComputedColumnsPanelTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const open = useGridSelector(apiRef, gridComputedColumnsPanelOpenSelector);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const isAvailable =
      rootProps.featureDependencies?.formula !== undefined &&
      !rootProps.disableComputedColumns &&
      !rootProps.disableFormulas &&
      !rootProps.dataSource;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hideComputedColumnEditor();
      } else {
        // No editor request: the panel opens on the list. The trigger's id is the
        // sidebar's label and the element focused again when the panel closes.
        apiRef.current.showSidebar(GridSidebarValue.ComputedColumns, panelId, buttonId);
      }
      onClick?.(event);
    };

    const element = useComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
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

    if (!isAvailable) {
      return null;
    }

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ComputedColumnsPanelTrigger.propTypes /* remove-proptypes */ = {
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

export { ComputedColumnsPanelTrigger };
