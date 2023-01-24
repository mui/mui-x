import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

const defaultValue = dayjs('2022-04-07T14:30:22');

export default function SingleDateFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateField", "TimeField", "DateTimeField"]}>
        <DemoItem label="DateField" components={["DateField"]}>
          <DateField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="TimeField" components={["TimeField"]}>
          <TimeField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="DateTimeField" components={["DateTimeField"]}>
          <DateTimeField defaultValue={defaultValue} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
