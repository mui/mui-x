import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function MultiInputFieldSeparatorSlotProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <MultiInputDateRangeField
          slotProps={{ separator: { sx: { opacity: 0.5 } } }}
        />
        <DateRangePicker
          slotProps={{
            field: { slotProps: { separator: { sx: { opacity: 0.5 } } } } as any,
          }}
          slots={{ field: MultiInputDateRangeField }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
