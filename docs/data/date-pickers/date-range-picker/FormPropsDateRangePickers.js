import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function FormPropsDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <DemoItem label="disabled" components={['DateRangePicker']}>
          <DateRangePicker disabled />
        </DemoItem>
        <DemoItem label="readOnly" components={['DateRangePicker']}>
          <DateRangePicker readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
