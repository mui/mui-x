import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function DigitalClockValue() {
  const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoContainer components={['DigitalClock', 'DigitalClock']}>
          <DemoItem label="Uncontrolled digital clock">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
          </DemoItem>
          <DemoItem label="Controlled digital clock">
            <DigitalClock
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoItem>
        </DemoContainer>
        <DemoContainer
          components={['MultiSectionDigitalClock', 'MultiSectionDigitalClock']}
        >
          <DemoItem label="Uncontrolled multi section digital clock">
            <MultiSectionDigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
          </DemoItem>
          <DemoItem label="Controlled multi section digital clock">
            <MultiSectionDigitalClock
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoItem>
        </DemoContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}
