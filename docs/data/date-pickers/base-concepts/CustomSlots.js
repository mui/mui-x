import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

const StyledButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));

export default function CustomSlots() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          slots={{
            openPickerIcon: EditCalendarRoundedIcon,
            openPickerButton: StyledButton,
          }}
          slotProps={{
            openPickerIcon: { fontSize: 'large' },
            openPickerButton: { color: 'secondary' },
            textField: {
              variant: 'filled',
              focused: true,
              color: 'secondary',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
