import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function GridItem({
  label,
  children,
  spacing = 1,
}: {
  label: string;
  children: React.ReactNode;
  spacing?: number;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ mb: spacing }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function DateCalendarViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label={'"year" and "day" (default)'} spacing={2}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} views={['year', 'day']} />
        </GridItem>
        <GridItem label={'"day"'} spacing={2}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} views={['day']} />
        </GridItem>
        <GridItem label={'"month" and "year"'} spacing={2}>
          <DateCalendar
            defaultValue={dayjs('2022-04-07')}
            views={['month', 'year']}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
