import { useThemeProps } from '@mui/material/styles';
import { DatePickerDesktopProps } from './DatePickerDesktopProps';

export const useDatePickerProps = (inProps: DatePickerDesktopProps) => {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePickerDesktop' });

  return props;
};
