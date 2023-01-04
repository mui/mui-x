import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function BasicTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MultiInputTimeRangeField />
        <SingleInputTimeRangeField />
      </DemoContainer>
    </LocalizationProvider>
  );
}
