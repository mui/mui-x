import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Unstable_NextTimePicker as NextTimePicker,
  NextTimePickerProps,
} from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const shouldDisableTime: NextTimePickerProps<Dayjs>['shouldDisableTime'] = (
  timeValue,
  view,
) => view === 'minutes' && timeValue >= 45;

const defaultValue = dayjs().set('hour', 10).set('minute', 50).startOf('minute');

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

export default function TimeValidationShouldDisableTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="TimePicker">
          <NextTimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={defaultValue}
            shouldDisableTime={shouldDisableTime}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
