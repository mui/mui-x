import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

const date1 = dayjs('2022-04-07T14:30:22');
const date2 = dayjs('2022-04-12T18:25:14');

export default function DateRangeFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="SingleInputDateRangeField">
          <SingleInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="MultiInputDateRangeField">
          <MultiInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="MultiInputTimeRangeField">
          <MultiInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="MultiInputDateTimeRangeField">
          <MultiInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
