import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

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

export default function DateRangePickerValue() {
  const [value, setValue] = React.useState([
    dayjs('2022-04-07'),
    dayjs('2022-04-10'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="Uncontrolled picker" spacing={2}>
          <NextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </GridItem>
        <GridItem label="Controlled picker" spacing={2}>
          <NextDateRangePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
