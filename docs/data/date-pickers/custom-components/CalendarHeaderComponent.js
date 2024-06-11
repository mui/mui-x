import * as React from 'react';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props) {
  const { currentMonth, onMonthChange } = props;

  const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'), 'left');
  const selectNextYear = () => onMonthChange(currentMonth.add(1, 'year'), 'left');
  const selectPreviousMonth = () =>
    onMonthChange(currentMonth.subtract(1, 'month'), 'right');
  const selectPreviousYear = () =>
    onMonthChange(currentMonth.subtract(1, 'year'), 'right');

  return (
    <CustomCalendarHeaderRoot>
      <Stack spacing={1} direction="row">
        <IconButton onClick={selectPreviousYear} title="Previous year">
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton onClick={selectPreviousMonth} title="Previous month">
          <ChevronLeft />
        </IconButton>
      </Stack>
      <Typography variant="body2">{currentMonth.format('MMMM YYYY')}</Typography>
      <Stack spacing={1} direction="row">
        <IconButton onClick={selectNextMonth} title="Next month">
          <ChevronRight />
        </IconButton>
        <IconButton onClick={selectNextYear} title="Next year">
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Stack>
    </CustomCalendarHeaderRoot>
  );
}

export default function CalendarHeaderComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
