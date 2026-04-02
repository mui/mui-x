import * as React from 'react';
import { FormControlProps } from '@mui/material/FormControl';
import { FormHelperTextProps } from '@mui/material/FormHelperText';
import { InputLabelProps } from '@mui/material/InputLabel';
import { TextFieldVariants } from '@mui/material/TextField';
import { PickersInputPropsUsedByField } from './PickersInputBase/PickersInputBase.types';
import type { PickersInputProps } from './PickersInput';
import type { PickersOutlinedInputProps } from './PickersOutlinedInput';
import type { PickersFilledInputProps } from './PickersFilledInput';

interface PickersTextFieldPropsUsedByField {
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  disabled: boolean;
  /**
   * If `true`, the `input` will indicate an error.
   * The prop defaults to the value (`false`) inherited from the parent FormControl component.
   */
  error: boolean;
}

export interface PickersBaseTextFieldProps
  extends
    PickersInputPropsUsedByField,
    PickersTextFieldPropsUsedByField,
    Omit<
      FormControlProps,
      keyof PickersInputPropsUsedByField | keyof PickersTextFieldPropsUsedByField
    > {
  /**
   * Props applied to the [`FormHelperText`](https://mui.com/material-ui/api/form-helper-text/) element.
   * @deprecated Use `slotProps.formHelperText` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  /**
   * Props applied to the [`InputLabel`](https://mui.com/material-ui/api/input-label/) element.
   * Pointer events like `onClick` are enabled if and only if `shrink` is `true`.
   * @deprecated Use `slotProps.inputLabel` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
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
   * It will be a [`FilledInput`](https://mui.com/material-ui/api/filled-input/),
   * [`OutlinedInput`](https://mui.com/material-ui/api/outlined-input/) or [`Input`](https://mui.com/material-ui/api/input/)
   * component depending on the `variant` prop value.
   * @deprecated Use `slotProps.input` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
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
   * It will be a [`FilledInput`](https://mui.com/material-ui/api/filled-input/),
   * [`OutlinedInput`](https://mui.com/material-ui/api/outlined-input/) or [`Input`](https://mui.com/material-ui/api/input/)
   * component depending on the `variant` prop value.
   * @deprecated Use `slotProps.input` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
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
   * It will be a [`FilledInput`](https://mui.com/material-ui/api/filled-input/),
   * [`OutlinedInput`](https://mui.com/material-ui/api/outlined-input/) or [`Input`](https://mui.com/material-ui/api/input/)
   * component depending on the `variant` prop value.
   * @deprecated Use `slotProps.input` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  InputProps?: Partial<PickersFilledInputProps>;
}

export type PickersTextFieldProps<Variant extends TextFieldVariants = TextFieldVariants> =
  Variant extends 'filled'
    ? PickersFilledTextFieldProps
    : Variant extends 'standard'
      ? PickersStandardTextFieldProps
      : PickersOutlinedTextFieldProps;
