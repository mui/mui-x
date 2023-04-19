import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

const shouldDisableTime = (value, view) => {
  if (view === 'hours') {
    return value.hour() % 2 === 0;
  }
  if (view === 'minutes') {
    return value.minute() % 10 === 0;
  }
  return false;
};

export default function DigitalClockSkipDisabled() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock
            skipDisabled
            minTime={dayjs('2022-04-17T09:00')}
            timeSteps={{
              minutes: 60,
            }}
          />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock
            skipDisabled
            shouldDisableTime={shouldDisableTime}
            defaultValue={dayjs('2022-04-17T01:05')}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
