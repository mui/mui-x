import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const today = dayjs();

const isInCurrentYear = (date: Dayjs) => date.get('year') === dayjs().get('year');

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

export default function DateValidationShouldDisableYear() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <NextDatePicker defaultValue={today} shouldDisableYear={isInCurrentYear} />
        </GridItem>
        <GridItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={today}
            shouldDisableYear={isInCurrentYear}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
