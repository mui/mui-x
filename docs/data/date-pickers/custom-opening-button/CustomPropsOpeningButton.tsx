import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomPropsOpeningButton() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          slotProps={{
            // Targets the `IconButton` component.
            openPickerButton: {
              color: 'primary',
            },
            // Targets the `InputAdornment` component.
            inputAdornment: {
              component: 'span',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
