import * as React from 'react';
import { FormControlOwnProps, FormControlProps } from '@mui/material/FormControl';
import { FormHelperTextProps } from '@mui/material/FormHelperText';
import { InputLabelProps } from '@mui/material/InputLabel';
import { TextFieldVariants } from '@mui/material/TextField';
import { PickersInputPropsUsedByField } from './PickersInputBase/PickersInputBase.types';
import type { PickersInputProps } from './PickersInput';
import type { PickersOutlinedInputProps } from './PickersOutlinedInput';
import type { PickersFilledInputProps } from './PickersFilledInput';
import { FieldOwnerState } from '../models';

interface PickersTextFieldPropsUsedByField {
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  disabled: boolean;
  error: boolean;
}

export interface PickersBaseTextFieldProps
  extends PickersInputPropsUsedByField,
    PickersTextFieldPropsUsedByField,
    Omit<
      FormControlProps,
      keyof PickersInputPropsUsedByField | keyof PickersTextFieldPropsUsedByField
    > {
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  InputLabelProps?: Partial<InputLabelProps>;
  /**
   * The helper text content.
   */
  helperText?: React.ReactNode;
}

export interface PickersStandardTextFieldProps extends PickersBaseTextFieldProps {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'standard';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<PickersInputProps>;
}
export interface PickersOutlinedTextFieldProps extends PickersBaseTextFieldProps {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'outlined';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<PickersOutlinedInputProps>;
}
export interface PickersFilledTextFieldProps extends PickersBaseTextFieldProps {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'filled';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<PickersFilledInputProps>;
}

export type PickersTextFieldProps<Variant extends TextFieldVariants = TextFieldVariants> =
  Variant extends 'filled'
    ? PickersFilledTextFieldProps
    : Variant extends 'standard'
      ? PickersStandardTextFieldProps
      : PickersOutlinedTextFieldProps;

export interface PickerTextFieldOwnerState extends FieldOwnerState {
  // Should be moved to FieldOwnerState once we drop the textField slot.
  /**
   * `true` if the value of the field is currently empty.
   */
  isFieldValueEmpty: boolean;
  // Should be moved to FieldOwnerState once we drop the textField slot.
  /**
   * `true` if the field is focused, `false` otherwise.
   */
  isFieldFocused: boolean;
  // Should be moved to FieldOwnerState once we drop the textField slot.
  /**
   * `true` if the field has an error, `false` otherwise.
   */
  hasFieldError: boolean;
  /**
   * The size of the input.
   */
  inputSize: Exclude<FormControlOwnProps['size'], undefined>;
  /**
   * The color of the input.
   */
  inputColor: Exclude<FormControlOwnProps['color'], undefined>;
  /**
   * `true` if the input takes up the full width of its container.
   */
  isInputInFullWidth: boolean;
  /**
   * `true` if the input has a start adornment, `false` otherwise.
   */
  hasStartAdornment: boolean;
  /**
   * `true` if the input has an end adornment, `false` otherwise.
   */
  hasEndAdornment: boolean;
  /**
   * `true` if the input has a label, `false` otherwise.
   */
  inputHasLabel: boolean;
}
