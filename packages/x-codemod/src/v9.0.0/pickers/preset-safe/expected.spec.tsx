import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

// Use this space to add tests that touch multiple codemods in the preset-safe package
// It is important to ensure that the codemods don't conflict with each other
// For example, if one codemod changes a prop name, another codemod modifying its value should work too.
// Don't hesitate to add props on existing components.

function App() {
  const fieldRef = React.useRef(null);

  return (
    <div>
      <DateField fieldRef={fieldRef} />
      <DatePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateRangePicker slotProps={{ field: { fieldRef: fieldRef } }} />
    </div>
  );
}
