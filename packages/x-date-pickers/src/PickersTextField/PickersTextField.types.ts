import * as React from 'react';
import { FormControlProps } from '@mui/material/FormControl';
import { FormHelperTextProps } from '@mui/material/FormHelperText';
import { InputLabelProps } from '@mui/material/InputLabel';
import { TextFieldVariants } from '@mui/material/TextField';
import {
  PickersInputBaseProps,
  PickersInputPropsUsedByField,
} from './PickersInputBase/PickersInputBase.types';
import type { PickersInputProps } from './PickersInput';
import type { PickersOutlinedInputProps } from './PickersOutlinedInput';
import type { PickersFilledInputProps } from './PickersFilledInput';

export interface PickersTextFieldSlots {
  /**
   * The component used for the root slot.
   * @default FormControl
   */
  root?: React.ElementType;
  /**
   * The component used for the input slot.
   * Defaults to one of `PickersInput`, `PickersFilledInput`, `PickersOutlinedInput` based on `variant`.
   * @default PickersOutlinedInput
   */
  input?: React.ElementType;
  /**
   * The component used for the input label slot.
   * @default InputLabel
   */
  inputLabel?: React.ElementType;
  /**
   * The component rendered as the underlying hidden `<input>` element.
   * @default PickersInputBaseInput
   */
  htmlInput?: React.ElementType;
  /**
   * The component used for the form helper text slot.
   * @default FormHelperText
   */
  formHelperText?: React.ElementType;
}

export interface PickersTextFieldSlotProps<InputPropsType extends PickersInputBaseProps> {
  root?: Partial<FormControlProps>;
  input?: Partial<InputPropsType>;
  inputLabel?: Partial<InputLabelProps>;
  htmlInput?: React.ComponentPropsWithRef<'input'>;
  formHelperText?: Partial<FormHelperTextProps>;
}

export interface PickersTextFieldSlotsAndSlotProps<InputPropsType extends PickersInputBaseProps> {
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots?: PickersTextFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersTextFieldSlotProps<InputPropsType>;
}

interface PickersTextFieldPropsUsedByField {
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  disabled: boolean;
  /**
   * If `true`, the `input` will indicate an error.
   * @default false
   */
  error: boolean;
}

export interface PickersBaseTextFieldProps
  extends
    PickersInputPropsUsedByField,
    PickersTextFieldPropsUsedByField,
    Omit<
      FormControlProps,
      | keyof PickersInputPropsUsedByField
      | keyof PickersTextFieldPropsUsedByField
      | 'slots'
      | 'slotProps'
    > {
  /**
   * The helper text content.
   */
  helperText?: React.ReactNode;
}

export interface PickersStandardTextFieldProps
  extends PickersBaseTextFieldProps, PickersTextFieldSlotsAndSlotProps<PickersInputProps> {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'standard';
}

export interface PickersOutlinedTextFieldProps
  extends PickersBaseTextFieldProps, PickersTextFieldSlotsAndSlotProps<PickersOutlinedInputProps> {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'outlined';
}

export interface PickersFilledTextFieldProps
  extends PickersBaseTextFieldProps, PickersTextFieldSlotsAndSlotProps<PickersFilledInputProps> {
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'filled';
}

export type PickersTextFieldProps<Variant extends TextFieldVariants = TextFieldVariants> =
  Variant extends 'filled'
    ? PickersFilledTextFieldProps
    : Variant extends 'standard'
      ? PickersStandardTextFieldProps
      : PickersOutlinedTextFieldProps;
