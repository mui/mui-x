import * as React from 'react';
import { Dayjs } from 'dayjs';
import frLocale from 'dayjs/locale/fr';
import ruLocale from 'dayjs/locale/ru';
import deLocale from 'dayjs/locale/de';
import arSaLocale from 'dayjs/locale/ar-sa';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const localeMap = {
  en: undefined,
  fr: frLocale,
  de: deLocale,
  ru: ruLocale,
  ar: arSaLocale,
};

export default function LocalizedDatePicker() {
  const [locale, setLocale] = React.useState<keyof typeof localeMap>('ru');
  const [datePickerValue, setDatePickerValue] = React.useState<Dayjs | Date | null>(
    new Date(),
  );
  const [timePickerValue, setTimePickerValue] = React.useState<Dayjs | Date | null>(
    new Date(),
  );

  const selectLocale = (newLocale: any) => {
    setLocale(newLocale);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={localeMap[locale]}
    >
      <Stack spacing={3}>
        <ToggleButtonGroup value={locale} exclusive sx={{ mb: 2, display: 'block' }}>
          {Object.keys(localeMap).map((localeItem) => (
            <ToggleButton
              key={localeItem}
              value={localeItem}
              onClick={() => selectLocale(localeItem)}
            >
              {localeItem}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DatePicker
          value={datePickerValue}
          onChange={(newValue) => setDatePickerValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <TimePicker
          value={timePickerValue}
          onChange={(newValue) => setTimePickerValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
