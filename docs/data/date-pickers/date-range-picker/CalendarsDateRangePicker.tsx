import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

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

export default function CalendarsDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="1 calendar" spacing={2}>
          <NextDateRangePicker calendars={1} />
        </GridItem>
        <GridItem label="2 calendars" spacing={2}>
          <NextDateRangePicker calendars={2} />
        </GridItem>
        <GridItem label="3 calendars" spacing={2}>
          <NextDateRangePicker calendars={3} />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
