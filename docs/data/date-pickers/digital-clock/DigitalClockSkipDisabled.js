import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

const shouldDisableTime = (date, view) => {
  const hour = date.hour();
  if (view === 'hours') {
    return hour < 9 || hour > 13;
  }
  if (view === 'minutes') {
    const minute = date.minute();
    return minute > 20 && hour === 13;
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
            timeStep={60}
          />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock
            skipDisabled
            shouldDisableTime={shouldDisableTime}
            ampm={false}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
