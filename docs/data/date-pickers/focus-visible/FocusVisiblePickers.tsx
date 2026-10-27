import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This week',
    getValue: () => [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  {
    label: 'Next 7 days',
    getValue: () => [dayjs(), dayjs().add(7, 'day')],
  },
  { label: 'Reset', getValue: () => [null, null] },
];

export default function FocusVisiblePickers() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(
        {
          focusVisible: true,
          components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
        },
        existingTheme,
      ),
    [existingTheme],
  );

  const value = dayjs().date(15).startOf('day').hour(9).minute(30);
  const range: DateRange<Dayjs> = [value, value.add(4, 'day').hour(17)];

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <DateCalendar
              views={['year', 'month', 'day']}
              defaultValue={value}
              sx={{ m: 0 }}
            />
            <MultiSectionDigitalClock
              defaultValue={value}
              sx={{ width: 'auto', m: 0 }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <DigitalClock defaultValue={value} sx={{ width: 'auto', m: 0 }} />
            <TimeClock defaultValue={value} sx={{ m: 0 }} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <DateRangeCalendar defaultValue={range} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <DatePicker
              label="Clearable date"
              defaultValue={value}
              slotProps={{ field: { clearable: true } }}
            />
            <DateTimeRangePicker
              label="Date and time range"
              defaultValue={range}
              slotProps={{
                shortcuts: { items: shortcutsItems },
                toolbar: { hidden: false },
              }}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
