import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../models';
import { QuickFilterState, useQuickFilterContext } from './QuickFilterContext';

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

    const element = useGridComponentRenderer(
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

QuickFilterControl.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  autoComplete: PropTypes.string,
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  color: PropTypes.oneOf(['error', 'primary']),
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  label: PropTypes.node,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  role: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'small']),
  slotProps: PropTypes.object,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOfType([
    PropTypes.oneOf([
      'button',
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'radio',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ]),
    PropTypes.object,
  ]),
  value: PropTypes.string,
} as any;

export { QuickFilterControl };
