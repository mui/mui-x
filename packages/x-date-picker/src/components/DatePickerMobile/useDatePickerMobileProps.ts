import { useThemeProps } from '@mui/material/styles';
import { DatePickerMobileProps } from './DatePickerMobileProps';

export const useDatePickerProps = (inProps: DatePickerMobileProps) => {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePickerMobile' });

  return props;
};
