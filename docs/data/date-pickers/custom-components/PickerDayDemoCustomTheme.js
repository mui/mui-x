import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { getDensePickerTheme } from './getDensePickerTheme';

export default function PickerDayDemoCustomTheme() {
  const currentTheme = useTheme();
  const theme = createTheme(getDensePickerTheme(currentTheme.palette.mode));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['StaticDateRangePicker']}>
        <ThemeProvider theme={theme}>
          <StaticDateRangePicker />
        </ThemeProvider>
      </DemoContainer>
    </LocalizationProvider>
  );
}
