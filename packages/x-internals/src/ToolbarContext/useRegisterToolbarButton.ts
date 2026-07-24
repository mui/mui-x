'use client';

import * as React from 'react';
import useId from '@mui/utils/useId';
import { useToolbarContext } from './ToolbarContext';

interface ToolbarItemProps extends Pick<
  React.ComponentProps<'button'>,
  'onKeyDown' | 'onFocus' | 'onBlur' | 'aria-disabled' | 'disabled'
> {}

export function useRegisterToolbarButton(
  props: ToolbarItemProps,
  ref: React.RefObject<HTMLButtonElement | null>,
) {
  const { onKeyDown, onFocus, onBlur, disabled, 'aria-disabled': ariaDisabled } = props;

  const id = useId();
  const {
    focusableItemId,
    registerItem,
    unregisterItem,
    onItemKeyDown,
    onItemFocus,
    onItemBlur,
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

  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    onItemBlur(id!, event);
    onBlur?.(event);
  };

  React.useEffect(() => {
    registerItem(id!, ref);
    return () => unregisterItem(id!);
  }, [id, ref, registerItem, unregisterItem]);

  const previousDisabled = React.useRef(disabled);
  React.useEffect(() => {
    if (previousDisabled.current !== disabled && disabled === true) {
      onItemDisabled(id!);
    }
    previousDisabled.current = disabled;
  }, [disabled, id, onItemDisabled]);

  const previousAriaDisabled = React.useRef(ariaDisabled);
  React.useEffect(() => {
    if (previousAriaDisabled.current !== ariaDisabled && ariaDisabled === true) {
      onItemDisabled(id!);
    }
    previousAriaDisabled.current = ariaDisabled;
  }, [ariaDisabled, id, onItemDisabled]);

  return {
    tabIndex: focusableItemId === id ? 0 : -1,
    disabled,
    'aria-disabled': ariaDisabled,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}
