import * as React from 'react';
import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import arSaLocale from 'date-fns/locale/ar-SA';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const localeMap = {
  en: enLocale,
  fr: frLocale,
  de: deLocale,
  ru: ruLocale,
  ar: arSaLocale,
};

const dateMaskMap = {
  fr: '__/__/____',
  en: '__/__/____',
  ru: '__.__.____',
  de: '__.__.____',
  ar: '',
};

export default function LocalizedDatePicker() {
  const [locale, setLocale] = React.useState<keyof typeof localeMap>('ru');
  const [dateValue, setDateValue] = React.useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = React.useState<Date | null>(new Date());

  const selectLocale = (newLocale: any) => {
    setLocale(newLocale);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
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
          mask={dateMaskMap[locale]}
          value={dateValue}
          onChange={(newValue) => setDateValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <TimePicker
          value={timeValue}
          onChange={(newValue) => setTimeValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
