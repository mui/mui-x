import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function YearButtonComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          openTo="year"
          slotProps={{
            yearButton: {
              sx: {
                color: '#1565c0',
                borderRadius: '2px',
                borderColor: '#2196f3',
                border: '1px solid',
                backgroundColor: '#90caf9',
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
