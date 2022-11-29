import * as React from 'react';
import { unstable_useForkRef as useForkRef } from '@mui/utils';

export interface BaseCheckboxProps {
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  size?: 'small' | 'medium';
  tabIndex?: number;
  className?: string;
  inputProps?: Record<string, any>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  disabled?: boolean;
  indeterminate?: boolean;
}

export const BaseCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (
    {
      id,
      inputRef,
      checked,
      onChange,
      tabIndex,
      className,
      inputProps,
      onKeyDown,
      disabled,
      // size,
      indeterminate,
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLInputElement | null>(null);
    const handleRef = useForkRef(rootRef, ref, inputRef);
    React.useEffect(() => {
      if (rootRef.current) {
        rootRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);
    return (
      <input
        ref={handleRef}
        id={id}
        className={className}
        disabled={disabled}
        tabIndex={tabIndex}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
    );
  },
);
