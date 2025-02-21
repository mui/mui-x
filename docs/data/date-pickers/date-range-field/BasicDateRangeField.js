import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function BasicDateRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputDateRangeField', 'MultiInputDateRangeField']}
      >
        <SingleInputDateRangeField label="Departure - Return" />
        <MultiInputDateRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Departure' : 'Return',
            }),
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
