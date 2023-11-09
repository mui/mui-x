import { TextFieldClasses } from '@mui/material/TextField';
import { FakeInputProps } from './FakeInput.types';

export interface FakeTextFieldProps extends FakeInputProps {
  classes?: Partial<TextFieldClasses>;
  className?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
  valueStr: string;
  InputProps: any;
  valueType: 'value' | 'placeholder';
  required?: boolean;
}
