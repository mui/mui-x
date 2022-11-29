import * as React from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function FormPropsDateRangePickers() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

  return (
    <Stack spacing={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          localeText={{ start: 'Disabled start', end: 'Disabled end' }}
          disabled
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
        <DateRangePicker
          localeText={{ start: 'Read-only start', end: 'Read-only end' }}
          readOnly
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}
