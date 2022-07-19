import * as React from 'react';
import { debounce } from '@mui/material/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import format from 'date-fns/format';
import isEqual from 'date-fns/isEqual';

const today = new Date();

export default function DebouncedDateField() {
  const [value, setValue] = React.useState(today);

  const debounceSetValue = React.useMemo(() => debounce(setValue, 500), []);

  return (
    <Stack spacing={2}>
      <Typography>
        Value outside the field:{' '}
        {value == null ? 'null' : format(value, 'dd/MM/yyyy')}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateField
          value={value}
          onChange={(newValue) => debounceSetValue(newValue)}
        />
      </LocalizationProvider>
      <Button
        onClick={() => setValue(today)}
        disabled={!!value && isEqual(value, today)}
      >
        Set to today
      </Button>
    </Stack>
  );
}
