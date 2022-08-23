import * as React from 'react';

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function FormPropsDateRangePickers() {
  const [value, setValue] = React.useState([null, null]);

  return (
    <Stack spacing={3}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        localeText={{ start: 'Disabled start', end: 'Disabled end' }}
      >
        <DateRangePicker
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
      </LocalizationProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        localeText={{ start: 'Read-only start', end: 'Read-only end' }}
      >
        <DateRangePicker
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
