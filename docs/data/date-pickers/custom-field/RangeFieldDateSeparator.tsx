import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function RangeFieldDateSeparator() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <DateRangePicker slotProps={{ field: { dateSeparator: 'to' } }} />
        <DateRangePicker
          slotProps={{ field: { dateSeparator: 'to' } }}
          slots={{ field: MultiInputDateRangeField }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
