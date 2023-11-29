import { BaseTextFieldProps, TextFieldClasses, TextFieldVariants } from '@mui/material/TextField';
import {
  CommonProps,
  PickersFilledInputProps,
  PickersOutlinedInputProps,
  PickersStandardInputProps,
} from '../PickersInput/PickersInput.types';

export interface PickersBaseTextFieldProps
  extends Omit<
      BaseTextFieldProps,
      | 'inputProps'
      | 'defaultValue'
      | 'onBlur'
      | 'onChange'
      | 'onFocus'
      | 'onInvalid'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'value'
    >,
    CommonProps {
  classes?: Partial<TextFieldClasses>;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
  valueStr: string;
  valueType: 'value' | 'placeholder';
  required?: boolean;
  inputProps?: React.HTMLAttributes<HTMLDivElement>;
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
  InputProps?: Partial<PickersStandardInputProps>;
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
