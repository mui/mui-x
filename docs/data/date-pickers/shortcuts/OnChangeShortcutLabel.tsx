import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {
  PickersShortcutsItem,
  PickersShortcutsItemContext,
} from '@mui/x-date-pickers/PickersShortcuts';
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers/models';

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
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

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
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
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
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
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function OnChangeShortcutLabel() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [lastShortcutSelected, setLastShortcutSelected] = React.useState<
    PickersShortcutsItemContext | undefined
  >(undefined);

  const handleChange = (
    newValue: Dayjs | null,
    ctx: PickerChangeHandlerContext<DateValidationError>,
  ) => {
    setValue(newValue);
    setLastShortcutSelected(ctx.shortcut);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <StaticDatePicker
          value={value}
          onChange={handleChange}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
          }}
        />
        <Typography>
          Selected shortcut on last onChange call:{' '}
          {lastShortcutSelected === undefined ? 'none' : lastShortcutSelected.label}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
