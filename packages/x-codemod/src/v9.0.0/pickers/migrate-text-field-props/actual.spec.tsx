// @ts-nocheck
import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';

function App() {
  return (
    <div>
      {/* prettier-ignore */}
      <DateField
        InputProps={{ name: 'birthday' }}
        inputProps={{ 'data-testid': 'html-input' }}
        InputLabelProps={{ shrink: true }}
        FormHelperTextProps={{ id: 'helper' }}
      />
      <DatePicker
        slotProps={{
          textField: {
            InputProps: { name: 'date' },
            inputProps: { 'data-testid': 'html-input' },
          },
          field: {
            InputProps: { name: 'field-input' },
          },
        }}
      />
      {/* prettier-ignore */}
      <PickersTextField
        InputProps={{ name: 'pickers-text-field' }}
        slotProps={{ input: { startAdornment: null } }}
      />
    </div>
  );
}
