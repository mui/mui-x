import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import {
  useGridComponentRenderer,
  RenderProp,
  useGridPanelContext,
} from '@mui/x-data-grid-pro/internals';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridSlotProps,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useForkRef } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface AiAssistantPanelState {
  /**
   * If `true`, the assistant panel is open.
   */
  open: boolean;
}

export type AiAssistantPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], AiAssistantPanelState>;
  /**
   * A function to customize rendering of the component.
   */
  className?: string | ((state: AiAssistantPanelState) => string);
};

/**
 * A button that opens and closes the assistant panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [AI Assistant Panel](https://mui.com/x/react-data-grid/components/ai-assistant-panel/)
 *
 * API:
 *
 * - [AiAssistantPanelTrigger API](https://mui.com/x/api/data-grid/ai-assistant-panel-trigger/)
 */
const AiAssistantPanelTrigger = forwardRef<HTMLButtonElement, AiAssistantPanelTriggerProps>(
  function AiAssistantPanelTrigger(props, ref) {
    const { render, className, onClick, onPointerUp, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.aiAssistant;
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const { aiAssistantPanelTriggerRef } = useGridPanelContext();
    const handleRef = useForkRef(ref, aiAssistantPanelTriggerRef);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.aiAssistant, panelId, buttonId);
      }
      onClick?.(event);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (open) {
        event.stopPropagation();
      }
      onPointerUp?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        id: buttonId,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        className: resolvedClassName,
        ...other,
        onClick: handleClick,
        onPointerUp: handlePointerUp,
        ref: handleRef,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

AiAssistantPanelTrigger.propTypes = {
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

export { AiAssistantPanelTrigger };
