import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={['TimeClock']}>
        <DemoItem label="disabled" content={['TimeClock']}>
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} disabled />
        </DemoItem>
        <DemoItem label="readOnly" content={['TimeClock']}>
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
