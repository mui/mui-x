import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import type { UseFieldInternalProps } from '../hooks/useField';
import type { FieldSection } from '../../models';

export interface BaseFieldProps<TValue, TSection extends FieldSection, TError>
  extends Omit<UseFieldInternalProps<TValue, TSection, TError>, 'format'> {
  className?: string;
  format?: string;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  ref?: React.Ref<HTMLDivElement>;
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
