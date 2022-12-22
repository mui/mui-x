import * as React from 'react';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function FormPropsDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="disabled">
          <NextDateRangePicker disabled />
        </DemoItem>
        <DemoItem label="readOnly">
          <NextDateRangePicker readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
