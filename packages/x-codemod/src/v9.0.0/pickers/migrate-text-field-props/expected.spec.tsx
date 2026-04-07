// @ts-nocheck
import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';

function App() {
  return (
    <div>
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
        }}
      />
      <DatePicker
        slotProps={{
          textField: {
            slotProps: {
              input: { name: 'date' },
              htmlInput: { 'data-testid': 'html-input' },
            },
          },
          field: {
            slotProps: {
              input: { name: 'field-input' },
            },
          },
        }}
      />
      <PickersTextField
        slotProps={{
          input: {
            startAdornment: null,
            name: 'pickers-text-field',
          },
        }}
      />
    </div>
  );
}
