import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MyPickersTextField = React.forwardRef((props, ref) => (
  <PickersTextField {...props} ref={ref} size="small" />
));

export default function MaterialV7FieldWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField
          enableAccessibleFieldDOMStructure
          slots={{ textField: MyPickersTextField }}
        />
        <DatePicker
          enableAccessibleFieldDOMStructure
          slots={{ textField: MyPickersTextField }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
