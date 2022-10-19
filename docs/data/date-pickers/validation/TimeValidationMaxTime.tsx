import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const fiveAM = dayjs().set('hour', 5).startOf('hour');
const nineAM = dayjs().set('hour', 9).startOf('hour');

const GridItem = ({
  label,
  children,
  spacing = 1,
}: {
  label: string;
  children: React.ReactNode;
  spacing?: number;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ mb: spacing }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export default function TimeValidationMaxTime() {
  const [timePickerValue, setTimePickerValue] = React.useState<Dayjs | null>(nineAM);
  const [dateTimePickerValue, setDateTimePickerValue] = React.useState<Dayjs | null>(
    nineAM,
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="TimePicker">
          <TimePicker
            maxTime={fiveAM}
            value={timePickerValue}
            onChange={(newValue) => setTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            maxTime={fiveAM}
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
