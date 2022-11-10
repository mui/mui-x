import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

function GridItem({
  label,
  children,
  spacing = 1,
}: {
  label: string;
  children: React.ReactNode;
  spacing?: number;
}) {
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

const date1 = dayjs('2022-04-07T14:30:22');
const date2 = dayjs('2022-04-12T18:25:14');

export default function DateRangeFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} width={550}>
        <GridItem label="SingleInputDateRangeField">
          <SingleInputDateRangeField defaultValue={[date1, date2]} />
        </GridItem>
        <GridItem label="MultiInputDateRangeField">
          <MultiInputDateRangeField defaultValue={[date1, date2]} />
        </GridItem>
        <GridItem label="MultiInputTimeRangeField">
          <MultiInputTimeRangeField defaultValue={[date1, date2]} />
        </GridItem>
        <GridItem label="MultiInputDateTimeRangeField">
          <MultiInputDateTimeRangeField defaultValue={[date1, date2]} />
        </GridItem>
      </Grid>
    </LocalizationProvider>
  );
}
