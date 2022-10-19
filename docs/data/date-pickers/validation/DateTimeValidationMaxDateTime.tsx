import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
const todayAt9AM = dayjs().set('hour', 9).startOf('hour');

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

export default function DateTimeValidationMaxDateTime() {
  const [value, setValue] = React.useState<Dayjs | null>(todayAtNoon);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GridItem label="DateTimePicker">
        <DateTimePicker
          maxDateTime={todayAt9AM}
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </GridItem>
    </LocalizationProvider>
  );
}
