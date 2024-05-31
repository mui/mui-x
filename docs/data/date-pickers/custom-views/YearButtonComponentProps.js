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
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
