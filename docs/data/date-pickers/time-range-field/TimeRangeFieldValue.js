import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function GridItem({ label, children, spacing = 1 }) {
  return (
    <Grid xs={12} item>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" sx={{ mb: spacing }}>
          {label}
        </Typography>
        {children}
      </Box>
    </Grid>
  );
}

// TODO: Use the same structure as on the other `XXXFieldValue` demos when using the single input version.

GridItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  spacing: PropTypes.number,
};

export default function TimeRangeFieldValue() {
  const [value, setValue] = React.useState(() => [
    dayjs('2022-04-07T15:30'),
    dayjs('2022-04-07T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} width={550}>
        <GridItem label="Uncontrolled field">
          <MultiInputTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-07T18:30')]}
          />
        </GridItem>
        <GridItem label="Controlled field">
          <MultiInputTimeRangeField
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </GridItem>
      </Grid>
    </LocalizationProvider>
  );
}
