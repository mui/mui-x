import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import 'dayjs/locale/fr';

export default function LocalizedDateField() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="French locale (default format)"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <DateField
          label="French locale (full letter month)"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="DD MMMM YYYY"
        />
      </Stack>
    </LocalizationProvider>
  );
}
