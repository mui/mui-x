import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useGridSelector } from '@mui/x-data-grid-pro';
import type { GridSlotProps } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridComputedColumnsPanelIdSelector,
  gridComputedColumnsPanelOpenSelector,
} from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import { gridPivotActiveSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
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
 * is missing, or `disableComputedColumns`, `disableFormulas` or `dataSource` is set)
 * and while pivoting is active.
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
    const apiRef = useGridPrivateApiContext();
    const open = useGridSelector(apiRef, gridComputedColumnsPanelOpenSelector);
    // The id of the open panel, whatever opened it: left out rather than dangling when
    // the panel was opened without one.
    const panelId = useGridSelector(apiRef, gridComputedColumnsPanelIdSelector);
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    // Like the column menu item: no computed column exists while pivoting is active.
    const isAvailable =
      rootProps.featureDependencies?.formula !== undefined &&
      !rootProps.disableComputedColumns &&
      !rootProps.disableFormulas &&
      !rootProps.dataSource &&
      !pivotActive;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hideComputedColumnEditor();
      } else {
        // No editor request: the panel opens on the list, with the id the other entry
        // points of the feature give it. The trigger's id is the sidebar's label and the
        // element focused again when the panel closes.
        apiRef.current.showSidebar(
          GridSidebarValue.ComputedColumns,
          apiRef.current.caches.computedColumns.panelId,
          buttonId,
        );
      }
      onClick?.(event);
    };

    const element = useComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': panelId,
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

export { ComputedColumnsPanelTrigger };
