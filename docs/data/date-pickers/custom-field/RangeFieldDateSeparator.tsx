import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

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
