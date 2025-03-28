import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function BasicDateTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateTimeRangeField',
          'MultiInputDateTimeRangeField',
        ]}
      >
        <SingleInputDateTimeRangeField label="Check-in - Check-out" />
        <MultiInputDateTimeRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Check-in' : 'Check-out',
            }),
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
