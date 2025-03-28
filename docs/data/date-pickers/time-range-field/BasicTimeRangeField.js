import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function BasicTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputTimeRangeField', 'MultiInputTimeRangeField']}
      >
        <SingleInputTimeRangeField label="From - To" />
        <MultiInputTimeRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'From' : 'To',
            }),
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
