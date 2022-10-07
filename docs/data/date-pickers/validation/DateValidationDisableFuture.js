import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TimePicker } from '@mui/x-date-pickers';

const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const todayEndOfTheDay = today.endOf('day');

const GridItem = ({ label, children, spacing = 1 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ mb: spacing }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

GridItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  spacing: PropTypes.number,
};

export default function DateValidationDisableFuture() {
  const [datePickerValue, setDatePickerValue] = React.useState(tomorrow);

  const [dateTimePickerValue, setDateTimePickerValue] = React.useState(tomorrow);

  const [timePickerValue, setTimePickerValue] = React.useState(todayEndOfTheDay);

  const [dateRangePickerValue, setDateRangePickerValue] = React.useState([
    today,
    tomorrow,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <DatePicker
            disableFuture
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            disableFuture
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
        <GridItem label="TimePicker">
          <TimePicker
            disableFuture
            value={timePickerValue}
            onChange={(newValue) => setTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2}>
          <DateRangePicker
            disableFuture
            value={dateRangePickerValue}
            onChange={(newValue) => setDateRangePickerValue(newValue)}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
