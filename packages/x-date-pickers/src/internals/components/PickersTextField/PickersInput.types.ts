import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { FieldsTextFieldProps } from '../../models';

export interface PickersInputElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement>;
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

export interface PickersInputProps extends FieldsTextFieldProps {
  elements: PickersInputElement[];
  areAllSectionsEmpty?: boolean;
  valueStr: string;
  onValueStrChange: React.ChangeEventHandler<HTMLInputElement>;
  id?: string;
  InputProps?: Partial<OutlinedInputProps>;
  inputProps: any;
  autoFocus?: boolean;
  ownerState?: any;
  onWrapperClick: () => void;
  defaultValue: string;
  label?: string;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  onBlur?: React.FocusEventHandler;
  onChange?: React.FormEventHandler;
  onFocus?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
}
