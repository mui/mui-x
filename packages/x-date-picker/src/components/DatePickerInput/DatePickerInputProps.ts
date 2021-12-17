import { CommonProps } from '@mui/material/OverridableComponent';

export interface DatePickerInputProps extends CommonProps {
  value: Date;
  onChange: (value: Date) => void;
  onOpenPopper: () => void;
  isPopperOpened: boolean;
}
