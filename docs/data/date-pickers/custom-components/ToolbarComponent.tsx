import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
} from '@mui/x-date-pickers/DatePicker';

function CustomToolbar(props: DatePickerToolbarProps) {
  return (
    <Box
      // Pass the className to the root element to get correct layout
      className={props.className}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <DatePickerToolbar {...props} />
      <RocketLaunchIcon fontSize="large" sx={{ m: 5 }} />
    </Box>
  );
}

export default function ToolbarComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            toolbarFormat: 'YYYY',
            toolbarPlaceholder: '??',
          },
          actionBar: {
            actions: ['clear'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
