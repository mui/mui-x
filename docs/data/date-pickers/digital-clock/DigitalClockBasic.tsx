import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DigitalClockBasic() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
