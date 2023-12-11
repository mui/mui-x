import * as React from 'react';
import { FormControlProps } from '@mui/material/FormControl';
import { FormHelperTextProps } from '@mui/material/FormHelperText';
import { InputLabelProps } from '@mui/material/InputLabel';
import { PickersInputOtherProps, PickersInputPropsUsedByField } from './PickersInput.types';

interface PickersTextFieldPropsUsedByField {
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  disabled: boolean;
  error: boolean;
}

export interface PickersTextFieldProps
  extends PickersInputPropsUsedByField,
    PickersTextFieldPropsUsedByField,
    Omit<
      FormControlProps,
      keyof PickersInputPropsUsedByField | keyof PickersTextFieldPropsUsedByField
    > {
  InputProps?: PickersInputOtherProps;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  InputLabelProps?: Partial<InputLabelProps>;
  /**
   * The helper text content.
   */
  helperText?: React.ReactNode;
}
