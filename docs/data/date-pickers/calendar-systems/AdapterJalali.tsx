import * as React from 'react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useTheme from '@mui/system/useTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AdapterJalali() {
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme({ direction: 'rtl' }, existingTheme),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl">
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DateTimePicker
            label="AdapterDateFnsJalali"
            defaultValue={new Date(2022, 1, 1, 12)}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
}
