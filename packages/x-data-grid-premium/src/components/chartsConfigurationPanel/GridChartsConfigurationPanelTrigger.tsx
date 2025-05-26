import * as React from 'react';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridComponentRenderer, RenderProp } from '@mui/x-data-grid-pro/internals';
import { GridSlotProps, useGridSelector } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridChartsConfigurationPanelOpenSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';

export interface ChartsIntegrationPanelState {
  /**
   * If `true`, the charts integration panel is open.
   */
  open: boolean;
}

export type ChartsIntegrationPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], ChartsIntegrationPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: ChartsIntegrationPanelState) => string);
};

/**
 * A button that opens and closes the charts integration panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Charts Integration Panel](https://mui.com/x/react-data-grid/components/charts-integration-panel/)
 *
 * API:
 *
 * - [ChartsIntegrationPanelTrigger API](https://mui.com/x/api/data-grid/charts-integration-panel-trigger/)
 */
const ChartsConfigurationPanelTrigger = forwardRef<
  HTMLButtonElement,
  ChartsIntegrationPanelTriggerProps
>(function ChartsIntegrationPanelTrigger(props, ref) {
  const { render, className, onClick, onPointerUp, ...other } = props;
  const rootProps = useGridRootProps();
  const buttonId = useId();
  const panelId = useId();
  const apiRef = useGridApiContext();
  const open = useGridSelector(apiRef, gridChartsConfigurationPanelOpenSelector);
  const state = { open };
  const resolvedClassName = typeof className === 'function' ? className(state) : className;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    apiRef.current.setChartsConfigurationPanelOpen(!open);
    onClick?.(event);
  };

  const element = useGridComponentRenderer(
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
});

export { ChartsConfigurationPanelTrigger };
