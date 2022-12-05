import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

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

export default function DateCalendarValue() {
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={{ xs: 4, xl: 2 }} direction={{ xs: 'column', xl: 'row' }}>
        <GridItem label="Uncontrolled calendar" spacing={2}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </GridItem>
        <GridItem label="Controlled calendar" spacing={2}>
          <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
