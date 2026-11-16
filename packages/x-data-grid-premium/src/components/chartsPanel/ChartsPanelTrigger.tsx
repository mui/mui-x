import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-data-grid-pro/internals';
import { useGridSelector } from '@mui/x-data-grid-pro';
import type { GridSlotProps } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { gridChartsPanelOpenSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { GridSidebarValue } from '../../hooks/features/sidebar';
import { gridSidebarPanelIdSelector } from '../../hooks/features/sidebar/gridSidebarSelector';

export interface ChartsPanelState {
  /**
   * If `true`, the charts integration panel is open.
   */
  open: boolean;
}

export type ChartsPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], ChartsPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: ChartsPanelState) => string);
};

/**
 * A button that opens and closes the charts integration panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Charts Panel](https://mui.com/x/react-data-grid/components/charts-panel/)
 *
 * API:
 *
 * - [ChartsPanelTrigger API](https://mui.com/x/api/data-grid/charts-panel-trigger/)
 */
const ChartsPanelTrigger = forwardRef<HTMLButtonElement, ChartsPanelTriggerProps>(
  function ChartsPanelTrigger(props, ref) {
    const { render, className, onClick, onPointerUp, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId(other.id);
    const apiRef = useGridApiContext();
    const open = useGridSelector(apiRef, gridChartsPanelOpenSelector);
    const panelId = useGridSelector(apiRef, gridSidebarPanelIdSelector, GridSidebarValue.Charts);
    const chartsContext = useGridChartsIntegrationContext(true);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hideSidebar();
      } else if (rootProps.chartsIntegration && chartsContext) {
        apiRef.current.showSidebar(GridSidebarValue.Charts, undefined, buttonId);
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

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ChartsPanelTrigger.propTypes /* remove-proptypes */ = {
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

export { ChartsPanelTrigger };
