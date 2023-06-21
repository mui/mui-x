import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
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
        <DemoItem label="Date Field">
          <DateField
            label="Date Field"
            clearable
            slots={{ clearIcon: HighlightOffIcon }}
          />
        </DemoItem>
        <DemoItem label="Date Range Field">
          <SingleInputDateRangeField
            label="Date Range Field"
            clearable
            slots={{ clearIcon: BackspaceIcon }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
