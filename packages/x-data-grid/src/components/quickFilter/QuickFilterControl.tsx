import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridSlotProps } from '../../models';
import { useQuickFilterContext } from './QuickFilterContext';
import type { QuickFilterState } from './QuickFilterContext';

export type QuickFilterControlProps = Omit<GridSlotProps['baseTextField'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseTextField'], QuickFilterState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: QuickFilterState) => string);
};

/**
 * A component that takes user input and filters row data.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterControl API](https://mui.com/x/api/data-grid/quick-filter-control/)
 */
const QuickFilterControl = forwardRef<HTMLInputElement, QuickFilterControlProps>(
  function QuickFilterControl(props, ref) {
    const { render, className, slotProps, onKeyDown, onChange, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, controlId, controlRef, onValueChange, onExpandedChange, clearValue } =
      useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(controlRef, ref);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        if (state.value === '') {
          onExpandedChange(false);
        } else {
          clearValue();
        }
      }

      onKeyDown?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (state.value === '') {
        onExpandedChange(false);
      }

      slotProps?.htmlInput?.onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!state.expanded) {
        onExpandedChange(true);
      }
      onValueChange(event);
      onChange?.(event);
    };

    const element = useComponentRenderer(
      rootProps.slots.baseTextField,
      render,
      {
        ...rootProps.slotProps?.baseTextField,
        slotProps: {
          htmlInput: {
            role: 'searchbox',
            id: controlId,
            tabIndex: state.expanded ? undefined : -1,
            ...slotProps?.htmlInput,
            onBlur: handleBlur,
          },
          ...slotProps,
        },
        value: state.value,
        className: resolvedClassName,
        ...other,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        ref: handleRef,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

QuickFilterControl.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The `autocomplete` attribute of the input element.
   */
  autoComplete: PropTypes.string,
  /**
   * If `true`, the input element is focused during the first mount.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The color of the text field.
   */
  color: PropTypes.oneOf(['error', 'primary']),
  /**
   * If `true`, the text field is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the text field is displayed in an error state.
   */
  error: PropTypes.bool,
  /**
   * If `true`, the text field takes up the full width of its container.
   */
  fullWidth: PropTypes.bool,
  /**
   * The helper text displayed below the input.
   */
  helperText: PropTypes.string,
  /**
   * The id of the input element.
   */
  id: PropTypes.string,
  /**
   * A ref to the input element.
   */
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  /**
   * The label of the text field.
   */
  label: PropTypes.node,
  /**
   * If `true`, a `textarea` element is rendered instead of an `input`.
   */
  multiline: PropTypes.bool,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The ARIA role of the root element.
   */
  role: PropTypes.string,
  /**
   * The size of the text field.
   */
  size: PropTypes.oneOf(['medium', 'small']),
  /**
   * The props used for each slot inside.
   */
  slotProps: PropTypes.object,
  style: PropTypes.object,
  /**
   * The `tabIndex` of the input element.
   */
  tabIndex: PropTypes.number,
  /**
   * The type of the input element.
   */
  type: PropTypes.string,
  /**
   * The value of the input element.
   */
  value: PropTypes.string,
} as any;

export { QuickFilterControl };
