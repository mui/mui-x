import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function DatePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDatePicker
          label={'"year", "month" and "day"'}
          defaultValue={dayjs('2022-04-07')}
          views={['year', 'month', 'day']}
        />
        <NextDatePicker
          label={'"day"'}
          defaultValue={dayjs('2022-04-07')}
          views={['day']}
        />
        <NextDatePicker
          label={'"month" and "year"'}
          defaultValue={dayjs('2022-04-07')}
          views={['month', 'year']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
