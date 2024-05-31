import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function MonthButtonComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          slotProps={{
            monthButton: {
              sx: {
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'primary.main',
              },
            },
          }}
          views={['month', 'day']}
          openTo="month"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
