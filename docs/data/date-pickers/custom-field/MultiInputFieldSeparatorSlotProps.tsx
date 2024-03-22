import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function MultiInputFieldSeparatorSlotProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <DateRangePicker slotProps={{ fieldSeparator: { variant: 'body2' } }} />
        <DateRangePicker slotProps={{ fieldSeparator: { sx: { opacity: 0.5 } } }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
