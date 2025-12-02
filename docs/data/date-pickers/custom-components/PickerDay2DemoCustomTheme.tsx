import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';
import { getDensePickerTheme } from './getDensePickerTheme';

export default function PickerDay2DemoCustomTheme() {
  const currentTheme = useTheme();
  const theme = createTheme(getDensePickerTheme(currentTheme.palette.mode));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <ThemeProvider theme={theme}>
          <StaticDateRangePicker
            slotProps={{
              actionBar: {
                actions: ['accept', 'cancel'],
              },
            }}
            slots={{ day: DateRangePickerDay2 }}
          />
        </ThemeProvider>
      </Box>
    </LocalizationProvider>
  );
}
