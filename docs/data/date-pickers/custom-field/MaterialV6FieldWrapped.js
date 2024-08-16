import * as React from 'react';
import MuiTextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TextField = React.forwardRef((props, ref) => (
  <MuiTextField {...props} ref={ref} size="small" />
));

export default function MaterialV6FieldWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField slots={{ textField: TextField }} />
        <DatePicker slots={{ textField: TextField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
