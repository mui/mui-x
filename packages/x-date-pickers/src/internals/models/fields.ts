import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import type { UseFieldInternalProps } from '../hooks/useField';

export interface BaseFieldProps<TValue, TError>
  extends Omit<UseFieldInternalProps<TValue, TError>, 'format'> {
  format?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  ref?: React.Ref<HTMLDivElement>;
  components?: {
    Input?: React.ElementType<TextFieldProps>;
  };
  componentsProps?: {
    input?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
  };
}
