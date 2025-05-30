import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

function WrappedMultiInputDateRangeField(props) {
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
