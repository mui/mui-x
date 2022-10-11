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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day');

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

export default function DateValidationDisablePast() {
  const [datePickerValue, setDatePickerValue] = React.useState(yesterday);

  const [dateTimePickerValue, setDateTimePickerValue] = React.useState(yesterday);

  const [timePickerValue, setTimePickerValue] = React.useState(todayStartOfTheDay);

  const [dateRangePickerValue, setDateRangePickerValue] = React.useState([
    yesterday,
    today,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <DatePicker
            disablePast
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            disablePast
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
        <GridItem label="TimePicker">
          <TimePicker
            disablePast
            value={timePickerValue}
            onChange={(newValue) => setTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2}>
          <DateRangePicker
            disablePast
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
