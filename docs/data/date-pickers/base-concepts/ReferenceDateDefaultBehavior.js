import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function ReferenceDateDefaultBehavior() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DemoItem label="No validation: uses today">
          <DateTimePicker />
        </DemoItem>
        <DemoItem label="Validation: uses the first day after `maxDate`">
          <DateTimePicker maxDate={dayjs('2022-04-17')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
