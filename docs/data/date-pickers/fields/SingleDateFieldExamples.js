import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';

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

GridItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  spacing: PropTypes.number,
};

const date1 = dayjs('2022-04-07T14:30:22');

export default function SingleDateFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} width={550}>
        <GridItem label="DateField">
          <DateField defaultValue={date1} />
        </GridItem>
        <GridItem label="TimeField">
          <TimeField defaultValue={date1} />
        </GridItem>
        <GridItem label="DateTimeField">
          <DateTimeField defaultValue={date1} />
        </GridItem>
      </Grid>
    </LocalizationProvider>
  );
}
