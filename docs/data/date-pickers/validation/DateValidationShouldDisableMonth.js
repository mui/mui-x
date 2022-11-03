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

const today = dayjs();

const isInCurrentMonth = (date) => date.get('month') === dayjs().get('month');

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

export default function DateValidationShouldDisableMonth() {
  const [datePickerValue, setDatePickerValue] = React.useState(today);
  const [dateTimePickerValue, setDateTimePickerValue] = React.useState(today);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <DatePicker
            shouldDisableMonth={isInCurrentMonth}
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day']}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            shouldDisableMonth={isInCurrentMonth}
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
