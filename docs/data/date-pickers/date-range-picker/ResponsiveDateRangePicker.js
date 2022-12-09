import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { Unstable_MobileNextDateRangePicker as MobileNextDateRangePicker } from '@mui/x-date-pickers-pro/MobileNextDateRangePicker';
import { Unstable_DesktopNextDateRangePicker as DesktopNextDateRangePicker } from '@mui/x-date-pickers-pro/DesktopNextDateRangePicker';

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

export default function ResponsiveDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="For mobile" spacing={2}>
          <MobileNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </GridItem>
        <GridItem label="For desktop" spacing={2}>
          <DesktopNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </GridItem>
        <GridItem label="Responsive" spacing={2}>
          <NextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
