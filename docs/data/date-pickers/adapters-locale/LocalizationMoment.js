import * as React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/zh-cn';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const locales = ['en-us', 'en-gb', 'zh-cn', 'de'];

export default function LocalizationMoment() {
  const [locale, setLocale] = React.useState('en-us');

  if (moment.locale() !== locale) {
    moment.locale(locale);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <Stack spacing={3} sx={{ width: 300 }}>
        <ToggleButtonGroup
          value={locale}
          exclusive
          fullWidth
          onChange={(event, newLocale) => {
            if (newLocale != null) {
              setLocale(newLocale);
            }
          }}
        >
          {locales.map((localeItem) => (
            <ToggleButton key={localeItem} value={localeItem}>
              {localeItem}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DateField label="Date" defaultValue={moment('2022-04-17')} />
        <TimeField label="Time" defaultValue={moment('2022-04-17T18:30')} />
      </Stack>
    </LocalizationProvider>
  );
}
