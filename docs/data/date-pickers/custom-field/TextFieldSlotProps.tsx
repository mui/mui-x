import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function TextFieldSlotProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker
          label="Small picker"
          slotProps={{ textField: { size: 'small' } }}
        />
        <DatePicker
          label="Picker with helper text"
          slotProps={{ textField: { helperText: 'Please fill this field' } }}
        />
        <DatePicker
          label="Filled picker"
          slotProps={{ textField: { variant: 'filled' } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
