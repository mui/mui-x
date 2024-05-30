import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockAmPm() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoItem>
          <Typography variant="body2">
            Locale default behavior (enabled for enUS)
          </Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
        <DemoItem>
          <Typography variant="body2">AM PM enabled</Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} ampm />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock
                defaultValue={dayjs('2022-04-17T15:30')}
                ampm
              />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
        <DemoItem>
          <Typography variant="body2">AM PM disabled</Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} ampm={false} />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock
                defaultValue={dayjs('2022-04-17T15:30')}
                ampm={false}
              />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
