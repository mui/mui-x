import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const fiveAM = dayjs().set('hour', 5).startOf('hour');
const nineAM = dayjs().set('hour', 9).startOf('hour');

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

export default function TimeValidationMaxTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="TimePicker">
          <NextTimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </GridItem>
        <GridItem label="DateTimePicker">
          <NextDateTimePicker defaultValue={nineAM} maxTime={fiveAM} />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
