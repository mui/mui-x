import * as React from 'react';
import { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { PickersRangeCalendarHeaderProps } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props: PickersRangeCalendarHeaderProps<Dayjs>) {
  const { currentMonth, onMonthChange, month, calendars, monthIndex } = props;

  const selectNextMonth = () =>
    onMonthChange(currentMonth.add(calendars, 'month'), 'left');
  const selectPreviousMonth = () =>
    onMonthChange(currentMonth.subtract(calendars, 'month'), 'right');

  return (
    <CustomCalendarHeaderRoot>
      <IconButton
        onClick={selectPreviousMonth}
        sx={[
          monthIndex === 0
            ? {
                visibility: null,
              }
            : {
                visibility: 'hidden',
              },
        ]}
        title={`Previous ${calendars} month${calendars === 1 ? '' : 's'}`}
      >
        <ChevronLeft />
      </IconButton>
      <Typography>{month.format('MMMM YYYY')}</Typography>
      <IconButton
        onClick={selectNextMonth}
        sx={[
          monthIndex === calendars - 1
            ? {
                visibility: null,
              }
            : {
                visibility: 'hidden',
              },
        ]}
        title={`Next ${calendars} month${calendars === 1 ? '' : 's'}`}
      >
        <ChevronRight />
      </IconButton>
    </CustomCalendarHeaderRoot>
  );
}

export default function CalendarHeaderComponentRange() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
