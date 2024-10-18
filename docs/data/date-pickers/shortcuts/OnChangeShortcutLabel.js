import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const getMonthWeekday = (monthIndex, weekdayIndex, dayRank) => {
  // Helper to find for example the 3rd monday in Jun
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: "Valentine's Day",
    getValue: () => {
      const today = dayjs();
      // (February 14)
      return today.month(1).date(14);
    },
  },
  {
    label: 'Earth Day',
    getValue: () => {
      const today = dayjs();
      // (April 22)
      return today.month(3).date(22);
    },
  },
  {
    label: "Veterans' Day",
    getValue: () => {
      const today = dayjs();
      // (May 1)
      return today.month(10).date(1);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      const today = dayjs();
      // (July 4)
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Halloween',
    getValue: () => {
      const today = dayjs();
      // (October 31)
      return today.month(9).date(31);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      const today = dayjs();
      // (December 25)
      return today.month(11).date(25);
    },
  },
];

export default function OnChangeShortcutLabel() {
  const [value, setValue] = React.useState(null);
  const [lastShortcutSelected, setLastShortcutSelected] = React.useState(undefined);

  const handleChange = (newValue, ctx) => {
    setValue(newValue);
    setLastShortcutSelected(ctx.shortcut);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        spacing={2}
        sx={{ '@media (pointer: none), (pointer: coarse)': { width: '100%' } }}
      >
        <StaticDatePicker
          value={value}
          onChange={handleChange}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
          }}
        />
        <Typography sx={{ pb: 2 }}>
          Selected shortcut on last onChange call:{' '}
          {lastShortcutSelected === undefined ? 'none' : lastShortcutSelected.label}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
