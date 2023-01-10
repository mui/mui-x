import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function CustomFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDatePicker format="MM - DD - YYYY" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
