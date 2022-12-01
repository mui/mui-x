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

export default function DateCalendarValue() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={{ xs: 4, xl: 2 }} direction={{ xs: 'column', xl: 'row' }}>
        <GridItem label="disabled" spacing={2}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} disabled />
        </GridItem>
        <GridItem label="readOnly" spacing={2}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} readOnly />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
