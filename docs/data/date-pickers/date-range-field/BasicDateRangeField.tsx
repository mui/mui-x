import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

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
