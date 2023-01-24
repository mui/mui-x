import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const fiveAM = dayjs().set('hour', 5).startOf('hour');
const nineAM = dayjs().set('hour', 9).startOf('hour');

export default function TimeValidationMaxTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["NextTimePicker", "NextDateTimePicker"]}>
        <DemoItem label="TimePicker" components={["NextTimePicker"]}>
          <NextTimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </DemoItem>
        <DemoItem label="DateTimePicker" components={["NextDateTimePicker"]}>
          <NextDateTimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
