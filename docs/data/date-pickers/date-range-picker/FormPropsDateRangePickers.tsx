import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function FormPropsDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateRangePicker', 'DateRangePicker', 'DateRangePicker']}
      >
        <DateRangePicker label="disabled" disabled />
        <DateRangePicker label="readOnly" readOnly />
        <DateRangePicker label="name" name="startDateRange" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
