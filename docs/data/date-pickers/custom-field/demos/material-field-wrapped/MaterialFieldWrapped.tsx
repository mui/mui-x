import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MyPickersTextField = React.forwardRef(
  (props: PickersTextFieldProps, ref: React.Ref<HTMLDivElement>) => (
    <PickersTextField {...props} ref={ref} size="small" />
  ),
);

export default function MaterialFieldWrapped() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField slots={{ textField: MyPickersTextField }} />
        <DatePicker slots={{ textField: MyPickersTextField }} />
      </DemoContainer>
    </LocalizationProvider>
    // @focus-end
  );
}
