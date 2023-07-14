import * as React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function CalendarSxProp() {
  return (
    <StaticDatePicker
      sx={{
        '& .MuiDateCalendar-root': {
          '& *': { fontFamily: 'Arial' },
          '& .MuiPickersCalendarHeader-root *': {
            color: '#463B60',
            fontWeight: 500,
          },
          '& .MuiPickersDay-root': {
            '&.MuiButtonBase-root': { borderRadius: 2 },
            '&.Mui-selected': { background: '#463B60' },
          },
        },
      }}
    />
  );
}
