import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersTextField as MuiPickersTextField,
  PickersTextFieldProps,
} from '@mui/x-date-pickers/PickersTextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MaterialV7Field() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DatePicker textFieldVersion="v7" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
