import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '../_shared/DemoContainer';

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
