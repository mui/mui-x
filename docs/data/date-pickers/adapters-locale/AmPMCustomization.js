import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const locales = ['en', 'en-gb', 'de'];

export default function AmPMCustomization() {
  const [locale, setLocale] = React.useState('en');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <Stack spacing={3}>
        <ToggleButtonGroup
          value={locale}
          exclusive
          fullWidth
          onChange={(event, newLocale) => setLocale(newLocale)}
        >
          {locales.map((localeItem) => (
            <ToggleButton key={localeItem} value={localeItem}>
              {localeItem}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TimeField label="Locale default" defaultValue={dayjs('2022-04-07T18:30')} />
        <TimeField label="AM / PM" defaultValue={dayjs('2022-04-07T18:30')} ampm />
        <TimeField
          label="24 hours"
          defaultValue={dayjs('2022-04-07T18:30')}
          ampm={false}
        />
      </Stack>
    </LocalizationProvider>
  );
}
