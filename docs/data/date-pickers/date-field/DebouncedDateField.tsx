import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from '@mui/material/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const today = dayjs();

export default function DebouncedDateField() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  const debounceSetValue = React.useMemo(() => debounce(setValue, 500), []);

  return (
    <Stack spacing={2}>
      <Typography>
        Value outside the field: {value == null ? 'null' : value.format('L')}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateField
          value={value}
          onChange={(newValue) => debounceSetValue(newValue)}
        />
      </LocalizationProvider>
      <Button
        onClick={() => setValue(today)}
        disabled={!!value && value.isSame(today)}
      >
        Set to today
      </Button>
    </Stack>
  );
}
