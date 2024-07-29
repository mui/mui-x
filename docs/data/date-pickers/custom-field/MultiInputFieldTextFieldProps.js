import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function MultiInputFieldTextFieldProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker
          slotProps={{
            textField: ({ position }) => ({
              color: position === 'start' ? 'success' : 'warning',
              focused: true,
            }),
          }}
          defaultValue={[dayjs('2022-04-17'), null]}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
