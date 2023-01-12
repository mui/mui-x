import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';

const defaultValue = dayjs('2022-04-07T14:30:22');

export default function SingleDateFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DateField">
          <DateField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="TimeField">
          <TimeField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="DateTimeField">
          <DateTimeField defaultValue={defaultValue} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
