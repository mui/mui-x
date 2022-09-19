import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');

const GridItem = ({
  label,
  children,
  spacing = 1,
  size = 6,
}: {
  label: string;
  children: React.ReactNode;
  spacing?: number;
  size?: number;
}) => {
  return (
    <Grid xs={12} md={size} item>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" sx={{ mb: spacing }}>
          {label}
        </Typography>
        {children}
      </Box>
    </Grid>
  );
};

export default function DateValidationDisablePast() {
  const [datePickerValue, setDatePickerValue] = React.useState<Dayjs | null>(
    yesterday,
  );
  const [dateTimePickerValue, setDateTimePickerValue] = React.useState<Dayjs | null>(
    yesterday,
  );
  const [dateRangePickerValue, setDateRangePickerValue] = React.useState<
    DateRange<Dayjs>
  >([yesterday, today]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} width={550}>
        <GridItem label="DatePicker">
          <DatePicker
            disablePast
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            disablePast
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateRangePicker" spacing={2} size={12}>
          <DateRangePicker
            disablePast
            value={dateRangePickerValue}
            onChange={(newValue) => setDateRangePickerValue(newValue)}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} fullWidth />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} fullWidth />
              </React.Fragment>
            )}
          />
        </GridItem>
      </Grid>
    </LocalizationProvider>
  );
}
