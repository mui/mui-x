import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function BasicDesktopDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        enableAccessibleFieldDOMStructure
        slots={{ field: SingleInputDateRangeField }}
        defaultValue={[dayjs('2024-04-12'), dayjs('2024-04-14')]}
      />
    </LocalizationProvider>
  );
}
