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

const lastMonday = dayjs().startOf('week');
const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

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

export default function DateValidationShouldDisableDate() {
  const [datePickerValue, setDatePickerValue] = React.useState(nextSunday);

  const [dateTimePickerValue, setDateTimePickerValue] = React.useState(nextSunday);

  const [dateRangePickerValue, setDateRangePickerValue] = React.useState([
    lastMonday,
    nextSunday,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <DatePicker
            shouldDisableDate={isWeekend}
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            shouldDisableDate={isWeekend}
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2}>
          <DateRangePicker
            shouldDisableDate={isWeekend}
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
