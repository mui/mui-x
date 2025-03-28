import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

const date1 = dayjs('2022-04-17T15:30');
const date2 = dayjs('2022-04-21T18:30');

export default function DateRangeFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateRangeField',
          'SingleInputTimeRangeField',
          'SingleInputDateTimeRangeField',
          'MultiInputDateRangeField',
          'MultiInputTimeRangeField',
          'MultiInputDateTimeRangeField',
        ]}
      >
        <DemoItem label="SingleInputDateRangeField">
          <SingleInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="SingleInputTimeRangeField">
          <SingleInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="SingleInputDateTimeRangeField">
          <SingleInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateRangeField"
          component="MultiInputDateRangeField"
        >
          <MultiInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputTimeRangeField"
          component="MultiInputTimeRangeField"
        >
          <MultiInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateTimeRangeField"
          component="MultiInputDateTimeRangeField"
        >
          <MultiInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
