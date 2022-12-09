import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const lastMonday = dayjs().startOf('week');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date: Dayjs) => {
  const day = date.day();

  return day === 0 || day === 6;
};

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

export default function DateValidationShouldDisableDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <NextDatePicker
            defaultValue={nextSunday}
            shouldDisableDate={isWeekend}
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={nextSunday}
            shouldDisableDate={isWeekend}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2}>
          <NextDateRangePicker
            defaultValue={[lastMonday, nextSunday]}
            shouldDisableDate={isWeekend}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
