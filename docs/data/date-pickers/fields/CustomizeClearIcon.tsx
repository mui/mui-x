import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import BackspaceIcon from '@mui/icons-material/Backspace';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function CustomizeClearIcon() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'SingleInputDateRangeField']}>
        <DateField
          label="Date Field"
          clearable
          slots={{ clearIcon: HighlightOffIcon }}
        />
        <SingleInputDateRangeField
          label="Date Range Field"
          clearable
          slots={{ clearIcon: BackspaceIcon }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
