import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridSlotProps, RenderProp } from '@mui/x-data-grid-pro';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { PromptFieldState, usePromptFieldContext } from './PromptFieldContext';

export type PromptFieldControlProps = Omit<GridSlotProps['baseTextField'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseTextField'], PromptFieldState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: PromptFieldState) => string);
};

/**
 * A component that takes user input.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldControl API](https://mui.com/x/api/data-grid/prompt-field-control/)
 */
const PromptFieldControl = forwardRef<HTMLInputElement, PromptFieldControlProps>(
  function PromptFieldControl(props, ref) {
    const { render, className, onChange, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, onValueChange } = usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event);
      onChange?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseTextField,
      render,
      {
        ...rootProps.slotProps?.baseTextField,
        value: state.value,
        className: resolvedClassName,
        error: !!state.error,
        helperText: state.error,
        ...other,
        onChange: handleChange,
        ref,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

export { PromptFieldControl };
