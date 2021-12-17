import { CommonProps } from '@mui/material/OverridableComponent';

export interface DatePickerProps extends CommonProps {
  value: Date;
  onChange: (value: Date) => void;
}
