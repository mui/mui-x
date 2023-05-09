import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockTimeStep() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock timeStep={60} />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock
            timeSteps={{ hours: 2, minutes: 15, seconds: 10 }}
            views={['hours', 'minutes', 'seconds']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
