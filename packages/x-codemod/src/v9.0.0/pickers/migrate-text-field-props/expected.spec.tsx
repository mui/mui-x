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
        slotProps={{
          textField: {
            slotProps: {
              input: { name: 'birthday' },
              htmlInput: { 'data-testid': 'html-input' },
              inputLabel: { shrink: true },
              formHelperText: { id: 'helper' },
            },
          },
        }} />
      <DatePicker
        slotProps={{
          textField: {
            slotProps: {
              htmlInput: { 'data-testid': 'html-input' },

              input: {
                name: 'field-input',
              },
            },
          },
        }}
      />
      {/* prettier-ignore */}
      <PickersTextField
        slotProps={{
          input: {
            startAdornment: null,
            name: 'pickers-text-field',
          },
        }} />
    </div>
  );
}
