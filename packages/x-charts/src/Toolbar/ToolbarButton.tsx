'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { useToolbarContext } from './internals/ToolbarContext';
import { useChartsSlots } from '../context/ChartsSlotsContext';
import { ChartsSlotProps } from '../internals/material';

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

    const id = useId();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(buttonRef, ref);
    const {
      focusableItemId,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemDisabled,
    } = useToolbarContext();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onItemKeyDown(event);
      onKeyDown?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      onItemFocus(id!);
      onFocus?.(event);
    };

    React.useEffect(() => {
      registerItem(id!, buttonRef);
      return () => unregisterItem(id!);
    }, [id, registerItem, unregisterItem]);

    const previousDisabled = React.useRef(disabled);
    React.useEffect(() => {
      if (previousDisabled.current !== disabled && disabled === true) {
        onItemDisabled(id!, disabled);
      }
      previousDisabled.current = disabled;
    }, [disabled, id, onItemDisabled]);

    const previousAriaDisabled = React.useRef(ariaDisabled);
    React.useEffect(() => {
      if (previousAriaDisabled.current !== ariaDisabled && ariaDisabled === true) {
        onItemDisabled(id!, true);
      }
      previousAriaDisabled.current = ariaDisabled;
    }, [ariaDisabled, id, onItemDisabled]);

    const element = useComponentRenderer(slots.baseIconButton, render, {
      ...slotProps?.baseIconButton,
      tabIndex: focusableItemId === id ? 0 : -1,
      ...other,
      disabled,
      'aria-disabled': ariaDisabled,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      ref: handleRef,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  style: PropTypes.object,
} as any;

export { ToolbarButton };
