import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import type { FieldSection, UseFieldInternalProps } from '../hooks/useField';

export interface BaseFieldProps<TValue, TSection extends FieldSection, TError>
  extends Omit<UseFieldInternalProps<TValue, TSection, TError>, 'format'> {
  className?: string;
  format?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props the single input field can receive when used inside a picker.
 * Only contains what the MUI component are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export interface BaseSingleInputFieldProps<TValue, TSection extends FieldSection, TError>
  extends BaseFieldProps<TValue, TSection, TError> {
  label?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler;
  onBlur?: React.FocusEventHandler;
  focused?: boolean;
  id?: string;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  inputProps?: {
    'aria-label'?: string;
  };
  slots?: {};
  slotProps?: {};
}

export interface FieldsTextFieldProps
  extends Omit<
    TextFieldProps,
    | 'autoComplete'
    | 'error'
    | 'maxRows'
    | 'minRows'
    | 'multiline'
    | 'placeholder'
    | 'rows'
    | 'select'
    | 'SelectProps'
    | 'type'
  > {}
