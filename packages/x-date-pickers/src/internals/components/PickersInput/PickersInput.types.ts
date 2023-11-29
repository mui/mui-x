import { InputBaseProps } from '@mui/material/InputBase';

export interface PickersInputElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement>;
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

export interface CommonProps {
  elements: PickersInputElement[];
  defaultValue?: string;
  label?: React.ReactNode;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
  focused?: boolean;
  areAllSectionsEmpty?: boolean;
  value?: string;
}

export interface PickersInputProps
  extends Omit<
      InputBaseProps,
      | 'children'
      | 'defaultValue'
      | 'onBlur'
      | 'onChange'
      | 'onFocus'
      | 'onInvalid'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'value'
      | 'margin'
      | 'color'
    >,
    CommonProps {
  ownerState?: any;
  margin?: 'dense' | 'none' | 'normal';
  onWrapperClick: () => void;
  renderSuffix?: (state: {
    disabled?: boolean;
    error?: boolean;
    filled?: boolean;
    focused?: boolean;
    margin?: 'dense' | 'none' | 'normal';
    required?: boolean;
    adornedStart?: boolean;
  }) => React.ReactNode;
}

export interface PickersOutlinedInputProps extends PickersInputProps {
  notched?: boolean;
}
export interface PickersStandardInputProps extends PickersInputProps {
  disableUnderline?: boolean;
}
export interface PickersFilledInputProps extends PickersInputProps {
  disableUnderline?: boolean;
  hiddenLabel?: boolean;
}
