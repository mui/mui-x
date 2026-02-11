'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import useForkRef from '@mui/utils/useForkRef';
import { useRegisterToolbarButton } from '@mui/x-internals/ToolbarContext';
import { useChartsSlots } from '../context/ChartsSlotsContext';
import { type ChartsSlotProps } from '../internals/material';

export type ToolbarButtonProps = ChartsSlotProps['baseIconButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseIconButton']>;
};

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const { render, onKeyDown, onFocus, disabled, 'aria-disabled': ariaDisabled, ...other } = props;
    const { slots, slotProps } = useChartsSlots();

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(buttonRef, ref);
    const { tabIndex, ...toolbarButtonProps } = useRegisterToolbarButton(props, buttonRef);

    const element = useComponentRenderer(slots.baseIconButton, render, {
      ...slotProps?.baseIconButton,
      tabIndex,
      ...other,
      ...toolbarButtonProps,
      ref: handleRef,
    });

    return element;
  },
);

ToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ToolbarButton };
