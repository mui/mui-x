import { CommonProps } from '@mui/material/OverridableComponent';

export interface DatePickerDesktopProps extends CommonProps {
  value: Date;
  onChange: (value: Date) => void;
}
