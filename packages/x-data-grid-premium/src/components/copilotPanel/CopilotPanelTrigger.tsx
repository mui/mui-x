import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer, type RenderProp } from '@mui/x-internals/useComponentRenderer';
import { type GridSlotProps, useGridSelector } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridCopilotPanelOpenSelector } from '../../hooks/features/copilot/gridCopilotSelectors';
import { GridSidebarValue } from '../../hooks/features/sidebar';

export interface CopilotPanelState {
  /**
   * If `true`, the Copilot panel is open.
   */
  open: boolean;
}

export type CopilotPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], CopilotPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: CopilotPanelState) => string);
};

/**
 * A button that opens and closes the Copilot side panel.
 * It renders the `baseButton` slot.
 */
const CopilotPanelTrigger = forwardRef<HTMLButtonElement, CopilotPanelTriggerProps>(
  function CopilotPanelTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const open = useGridSelector(apiRef, gridCopilotPanelOpenSelector);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hideSidebar();
      } else {
        apiRef.current.showSidebar(GridSidebarValue.Copilot, panelId, buttonId);
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

    return <React.Fragment>{element}</React.Fragment>;
  },
);

CopilotPanelTrigger.propTypes = {
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

export { CopilotPanelTrigger };
