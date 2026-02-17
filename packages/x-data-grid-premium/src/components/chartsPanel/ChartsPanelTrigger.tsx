import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-data-grid-pro/internals';
import { type GridSlotProps, useGridSelector } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridChartsPanelOpenSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';

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
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const open = useGridSelector(apiRef, gridChartsPanelOpenSelector);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.setChartsPanelOpen(!open);
      onClick?.(event);
    };

    const element = useComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        // TODO: Hook up the panel/trigger IDs to the charts configuration panel
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

ChartsPanelTrigger.propTypes = {
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

export { ChartsPanelTrigger };
