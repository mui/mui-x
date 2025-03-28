import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { DemoContainer } from '../_shared/DemoContainer';

export default function FormPropsDateTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'DateTimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DateTimeRangePicker label="disabled" disabled />
        <DateTimeRangePicker label="readOnly" readOnly />
        <DateTimeRangePicker label="name" name="startDateTimeRange" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
