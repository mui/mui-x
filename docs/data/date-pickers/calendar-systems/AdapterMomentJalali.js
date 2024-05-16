import * as React from 'react';
import moment from 'moment-jalaali';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useTheme from '@mui/system/useTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AdapterMomentJalali() {
  moment.loadPersian({ dialect: 'persian-modern' });

  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme({ direction: 'rtl' }, existingTheme),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl">
        <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
          <DateTimePicker
            label="AdapterMomentJalaali"
            defaultValue={moment('2022-02-01T12:00:00')}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
}
