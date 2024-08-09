import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

const StyledButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));
const StyledDay = styled(PickersDay)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.secondary.light,
  ...theme.applyStyles('light', {
    color: theme.palette.secondary.dark,
  }),
}));

export default function CustomSlots() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Styled picker"
          slots={{
            openPickerIcon: EditCalendarRoundedIcon,
            openPickerButton: StyledButton,
            day: StyledDay,
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
