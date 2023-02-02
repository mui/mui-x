import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { TextFieldProps } from '@mui/material/TextField';
import type { UseFieldInternalProps } from '../hooks/useField';

export interface BaseFieldProps<TValue, TError>
  extends Omit<UseFieldInternalProps<TValue, TError>, 'format'> {
  className?: string;
  sx?: SxProps<Theme>;
  format?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props the single input field can receive when used inside a picker.
 * Do not take into account props that would be passed directly through `props.slotProps.field`.
 */
export interface BaseSingleInputFieldProps<TValue, TError>
  extends BaseFieldProps<TValue, TError>,
    Pick<TextFieldProps, 'InputProps' | 'inputProps'> {
  slots?: {
    textField?: React.ElementType<TextFieldProps>;
  };
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
