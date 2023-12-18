import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersTextField as MuiPickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PickersTextField = React.forwardRef((props, ref) => (
  <MuiPickersTextField {...props} ref={ref} size="small" />
));

export default function MaterialV7Field() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DatePicker slots={{ textField: PickersTextField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
