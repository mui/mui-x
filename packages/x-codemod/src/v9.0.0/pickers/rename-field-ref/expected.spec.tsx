import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

function App() {
  const fieldRef = React.useRef(null);
  const startRef = React.useRef(null);
  const endRef = React.useRef(null);

  return (
    <div>
      <DatePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <TimePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateTimePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateRangePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <TimeRangePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateTimeRangePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateField fieldRef={fieldRef} />
      <TimeField fieldRef={fieldRef} />
      <MultiInputDateRangeField startFieldRef={startRef} endFieldRef={endRef} />
    </div>
  );
}
