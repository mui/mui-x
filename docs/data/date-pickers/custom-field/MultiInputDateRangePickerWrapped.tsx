import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  MultiInputDateRangeField,
  MultiInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

function WrappedMultiInputDateRangeField(
  props: MultiInputDateRangeFieldProps<true>,
) {
  return <MultiInputDateRangeField spacing={4} {...props} />;
}

WrappedMultiInputDateRangeField.fieldType = 'multi-input';

export default function MultiInputDateRangePickerWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateRangeField']}>
        <DateRangePicker slots={{ field: WrappedMultiInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
