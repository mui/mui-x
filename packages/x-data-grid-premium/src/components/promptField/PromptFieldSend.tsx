import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridSlotProps, RenderProp } from '@mui/x-data-grid-pro';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { PromptFieldState, usePromptFieldContext } from './PromptFieldContext';

export type PromptFieldSendProps = Omit<GridSlotProps['baseIconButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton'], PromptFieldState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: PromptFieldState) => string);
};

/**
 * A button that processes the prompt when clicked.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldSend API](https://mui.com/x/api/data-grid/prompt-field-send/)
 */
const PromptFieldSend = forwardRef<HTMLButtonElement, PromptFieldSendProps>(
  function PromptFieldSend(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, onSubmit } = usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onSubmit(state.value);
      onClick?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseIconButton,
      render,
      {
        ...rootProps.slotProps?.baseIconButton,
        className: resolvedClassName,
        disabled: state.disabled || state.recording || !state.value,
        ...other,
        onClick: handleClick,
        ref,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

PromptFieldSend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['end', 'start', false]),
  id: PropTypes.string,
  label: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { PromptFieldSend };
