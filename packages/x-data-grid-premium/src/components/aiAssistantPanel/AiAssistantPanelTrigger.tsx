import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import {
  useGridComponentRenderer,
  RenderProp,
  useGridPanelContext,
} from '@mui/x-data-grid-pro/internals';
import { GridSlotProps, useGridSelector } from '@mui/x-data-grid-pro';
import { useForkRef } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridAiAssistantPanelOpenSelector } from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';

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
    const open = useGridSelector(apiRef, gridAiAssistantPanelOpenSelector);
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const { aiAssistantPanelTriggerRef } = useGridPanelContext();
    const handleRef = useForkRef(ref, aiAssistantPanelTriggerRef);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.unstable_aiAssistant.setAiAssistantPanelOpen((currentOpen) => !currentOpen);
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
        // TODO: Hook up the panel/trigger IDs to the assistant panel
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
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focusVisible: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: PropTypes.bool,
  /**
   * A function to customize rendering of the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: PropTypes.oneOf([
    'error',
    'info',
    'inherit',
    'primary',
    'secondary',
    'success',
    'warning',
  ]),
  component: PropTypes.elementType,
  /**
   * If `true`, the component is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, no elevation is used.
   * @default false
   */
  disableElevation: PropTypes.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: PropTypes.bool,
  /**
   * Element placed after the children.
   */
  endIcon: PropTypes.node,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: PropTypes.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth: PropTypes.bool,
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href: PropTypes.string,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: PropTypes.elementType,
  /**
   * If `true`, the loading indicator is visible and the button is disabled.
   * If `true | false`, the loading wrapper is always rendered before the children to prevent [Google Translation Crash](https://github.com/mui/material-ui/issues/27853).
   * @default null
   */
  loading: PropTypes.bool,
  /**
   * Element placed before the children if the button is in loading state.
   * The node should contain an element with `role="progressbar"` with an accessible name.
   * By default, it renders a `CircularProgress` that is labeled by the button itself.
   * @default <CircularProgress color="inherit" size={16} />
   */
  loadingIndicator: PropTypes.node,
  /**
   * The loading indicator can be positioned on the start, end, or the center of the button.
   * @default 'center'
   */
  loadingPosition: PropTypes.oneOf(['center', 'end', 'start']),
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /**
   * Element placed before the children.
   */
  startIcon: PropTypes.node,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  tabIndex: PropTypes.number,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: PropTypes.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: PropTypes.any,
  /**
   * The variant to use.
   * @default 'text'
   */
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
} as any;

export { AiAssistantPanelTrigger };
