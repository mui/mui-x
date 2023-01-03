import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';

export default function DatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DateField label="Date Field" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
