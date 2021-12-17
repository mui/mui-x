import { useThemeProps } from '@mui/material/styles';
import { DatePickerProps } from './DatePickerProps';

export const useDatePickerProps = (inProps: DatePickerProps) => {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePicker' });

  return props;
};
