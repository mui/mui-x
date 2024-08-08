import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const shouldDisableDate = (value) => value.date() === 6;
const start = dayjs().date(4);
const end = dayjs().date(7);

export default function DateValidationDisableNonContiguousRange() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DemoItem label="DateRangePicker">
          <DateRangePicker
            defaultValue={[start, end]}
            disableNonContiguousRanges
            shouldDisableDate={shouldDisableDate}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
