import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  SingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

function WrappedSingleInputDateRangeField(props: SingleInputDateRangeFieldProps) {
  return <SingleInputDateRangeField size="small" {...props} />;
}

WrappedSingleInputDateRangeField.fieldType = 'single-input';

export default function SingleInputDateRangePickerWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker slots={{ field: WrappedSingleInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
