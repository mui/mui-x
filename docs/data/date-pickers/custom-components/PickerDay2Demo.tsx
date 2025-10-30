import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickerDay2 } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

export default function PickerDay2Demo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <StaticDatePicker
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: PickerDay2 }}
        />
        <StaticDateRangePicker
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: DateRangePickerDay2 }}
        />
      </Box>
    </LocalizationProvider>
  );
}
