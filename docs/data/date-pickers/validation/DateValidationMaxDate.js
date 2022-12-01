import * as React from 'react';
import dayjs from 'dayjs';
import {
  PickersGrid,
  PickersGridItem,
} from 'docsx/src/modules/components/PickersGrid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');

export default function DateValidationMaxDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickersGrid>
        <PickersGridItem label="DatePicker">
          <NextDatePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day']}
          />
        </PickersGridItem>
        <PickersGridItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </PickersGridItem>
        <PickersGridItem label="DateRangePicker">
          <NextDateRangePicker
            defaultValue={[yesterday, today]}
            maxDate={yesterday}
          />
        </PickersGridItem>
      </PickersGrid>
    </LocalizationProvider>
  );
}
