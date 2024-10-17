import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { PickerValidDate, TimeView } from '@mui/x-date-pickers/models';

const shouldDisableTime = (date: PickerValidDate, view: TimeView) => {
  const dateWithKnownAdapter = date as Dayjs;
  const hour = dateWithKnownAdapter.hour();
  if (view === 'hours') {
    return hour < 9 || hour > 13;
  }
  if (view === 'minutes') {
    const minute = dateWithKnownAdapter.minute();
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
