import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function FormPropsDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['NextDateRangePicker', 'NextDateRangePicker']}>
        <DemoItem label="disabled" components={['NextDateRangePicker']}>
          <NextDateRangePicker disabled />
        </DemoItem>
        <DemoItem label="readOnly" components={['NextDateRangePicker']}>
          <NextDateRangePicker readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
