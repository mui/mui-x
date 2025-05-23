import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

const defaultValue = dayjs('2022-04-17T15:30');

export default function SingleDateFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'TimeField', 'DateTimeField']}>
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
