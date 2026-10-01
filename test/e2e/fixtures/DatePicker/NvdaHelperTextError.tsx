import * as React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError } from '@mui/x-date-pickers/models';

const maxDate = dayjs('2029-12-31');

// https://github.com/mui/mui-x/issues/16637
export default function NvdaHelperTextError() {
  const [error, setError] = React.useState<DateValidationError | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <button type="button">Before</button>
      <DatePicker
        defaultValue={maxDate}
        maxDate={maxDate}
        onError={setError}
        slotProps={{
          textField: {
            variant: 'standard',
            label: 'Appointment',
            helperText: error ? 'Date is too late' : '',
          },
        }}
      />
      <button type="button">After</button>
    </LocalizationProvider>
  );
}
