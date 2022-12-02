import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
const todayAt9AM = dayjs().set('hour', 9).startOf('hour');

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

export default function DateTimeValidationMaxDateTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GridItem label="DateTimePicker">
        <NextDateTimePicker defaultValue={todayAtNoon} maxDateTime={todayAt9AM} />
      </GridItem>
    </LocalizationProvider>
  );
}
