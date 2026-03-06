import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { FieldRef } from '@mui/x-date-pickers/models';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ImperativeClear() {
  const fieldRef = React.useRef<FieldRef<Dayjs | null>>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} direction="row" alignItems="center">
        <DateField label="DateField" fieldRef={fieldRef} />
        <Button
          variant="outlined"
          onClick={() => {
            fieldRef.current?.clearValue();
          }}
        >
          Clear Value
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
