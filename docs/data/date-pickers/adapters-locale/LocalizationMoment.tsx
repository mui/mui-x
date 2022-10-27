import * as React from 'react';
import moment from 'moment';
// @ts-ignore
import {} from 'moment/locale/de';
// @ts-ignore
import {} from 'moment/locale/en-gb';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const locales = ['en-us', 'en-gb', 'de'];

type LocaleKey = typeof locales[number];

export default function LocalizationMoment() {
  const [locale, setLocale] = React.useState<LocaleKey>('en-us');

  if (moment.locale() !== locale) {
    moment.locale(locale);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
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
        <DateField label="Date" defaultValue={moment('2022-04-07')} />
        <TimeField label="Time" defaultValue={moment('2022-04-07T18:30')} />
      </Stack>
    </LocalizationProvider>
  );
}
