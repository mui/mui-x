import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

import { DemoContainer } from '../_shared/DemoContainer';

export default function MultiInputFieldTextFieldProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['MultiInputDateRangeField', 'MultiInputDateRangeField']}
      >
        <MultiInputDateRangeField
          slotProps={{
            textField: ({ position }) => ({
              color: position === 'start' ? 'success' : 'warning',
              focused: true,
            }),
          }}
          defaultValue={[dayjs('2022-04-17'), null]}
        />
        <DateRangePicker
          slotProps={{
            textField: ({ position }) => ({
              color: position === 'start' ? 'success' : 'warning',
              focused: true,
            }),
          }}
          slots={{ field: MultiInputDateRangeField }}
          defaultValue={[dayjs('2022-04-17'), null]}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
