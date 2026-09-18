import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function CompactPicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={4} useFlexGap>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Default
          </Typography>
          <StaticDatePicker views={['year', 'month', 'day']} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Compact
          </Typography>
          <StaticDatePicker compact views={['year', 'month', 'day']} />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
