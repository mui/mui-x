import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

function App() {
  const fieldRef = React.useRef(null);
  const startRef = React.useRef(null);
  const endRef = React.useRef(null);

  return (
    <div>
      <DatePicker unstableFieldRef={fieldRef} />
      <DateRangePicker unstableFieldRef={fieldRef} />
      <MultiInputDateRangeField
        unstableStartFieldRef={startRef}
        unstableEndFieldRef={endRef}
      />
    </div>
  );
}
