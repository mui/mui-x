import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

const date1 = dayjs('2022-04-07T14:30:22');
const date2 = dayjs('2022-04-12T18:25:14');

export default function DateRangeFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "SingleInputDateRangeField",
          "MultiInputDateRangeField",
          "MultiInputTimeRangeField",
          "MultiInputDateTimeRangeField"
        ]}>
        <DemoItem
          label="SingleInputDateRangeField"
          components={["SingleInputDateRangeField"]}>
          <SingleInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateRangeField"
          components={["MultiInputDateRangeField"]}>
          <MultiInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputTimeRangeField"
          components={["MultiInputTimeRangeField"]}>
          <MultiInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateTimeRangeField"
          components={["MultiInputDateTimeRangeField"]}>
          <MultiInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
