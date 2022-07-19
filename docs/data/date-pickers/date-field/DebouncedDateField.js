import * as React from 'react';
import { debounce } from '@mui/material/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

export default function DebouncedDateField() {
  const [value, setValue] = React.useState(new Date());

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
    </Stack>
  );
}
