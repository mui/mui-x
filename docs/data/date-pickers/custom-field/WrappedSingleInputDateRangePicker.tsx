import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  SingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

type FieldComponent = (<TDate>(
  props: SingleInputDateRangeFieldProps<TDate> &
    React.RefAttributes<HTMLInputElement>,
) => React.JSX.Element) & { fieldType?: string };

const WrappedSingleInputDateRangeField = React.forwardRef(
  (
    props: SingleInputDateRangeFieldProps<Dayjs>,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return <SingleInputDateRangeField size="small" {...props} ref={ref} />;
  },
) as FieldComponent;

WrappedSingleInputDateRangeField.fieldType = 'single-input';

export default function WrappedSingleInputDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker slots={{ field: WrappedSingleInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
