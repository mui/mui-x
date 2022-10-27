import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const locales = ['en-us', 'en-gb', 'de'];

export default function LocalizationDayjs() {
  const [locale, setLocale] = React.useState('en-us');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <Stack spacing={3}>
        <ToggleButtonGroup value={locale} exclusive fullWidth>
          {locales.map((localeItem) => (
            <ToggleButton
              key={localeItem}
              value={localeItem}
              onClick={() => setLocale(localeItem)}
            >
              {localeItem}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DateField label="Date" defaultValue={dayjs('2022-04-07')} />
        <TimeField label="Time" defaultValue={dayjs('2022-04-07T18:30')} />
      </Stack>
    </LocalizationProvider>
  );
}
