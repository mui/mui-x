import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockAmPm() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock', 'TimeClock']}>
        <DemoItem
          label="Locale default behavior (enabled for enUS)"
          components={['TimeClock']}
        >
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="AM PM enabled" components={['TimeClock']}>
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} ampm />
        </DemoItem>
        <DemoItem label="AM PM disabled" components={['TimeClock']}>
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} ampm={false} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
