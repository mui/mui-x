import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function TimeClockFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock']}>
        <DemoItem label="disabled">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} disabled />
        </DemoItem>
        <DemoItem label="readOnly">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
