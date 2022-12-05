import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const todayEndOfTheDay = today.endOf('day');

function GridItem({ label, children, spacing = 1 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ mb: spacing }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  spacing: PropTypes.number,
};

export default function DateValidationDisableFuture() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <NextDatePicker
            defaultValue={tomorrow}
            disableFuture
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="TimePicker">
          <NextTimePicker defaultValue={todayEndOfTheDay} disableFuture />
        </GridItem>
        <GridItem label="DateTimePicker">
          <NextDateTimePicker
            defaultValue={tomorrow}
            disableFuture
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2}>
          <NextDateRangePicker defaultValue={[today, tomorrow]} disableFuture />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
