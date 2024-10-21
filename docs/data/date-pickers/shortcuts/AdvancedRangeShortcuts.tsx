import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'Next Available Weekend',
    getValue: ({ isValid }) => {
      const today = dayjs();
      const nextSaturday =
        today.day() <= 6
          ? today.add(6 - today.day(), 'day')
          : today.add(7 + 6 - today.day(), 'day');

      let maxAttempts = 50;
      let solution: [Dayjs, Dayjs] = [nextSaturday, nextSaturday.add(1, 'day')];
      while (maxAttempts > 0 && !isValid(solution)) {
        solution = [solution[0].add(7, 'day'), solution[1].add(7, 'day')];
        maxAttempts -= 1;
      }

      return solution;
    },
  },
  {
    label: 'Next Available Week',
    getValue: ({ isValid }) => {
      const today = dayjs();
      const nextMonday =
        today.day() <= 1
          ? today.add(1 - today.day(), 'day')
          : today.add(7 + 1 - today.day(), 'day');

      let maxAttempts = 50;
      let solution: [Dayjs, Dayjs] = [nextMonday, nextMonday.add(4, 'day')];
      while (maxAttempts > 0 && !isValid(solution)) {
        solution = [solution[0].add(7, 'day'), solution[1].add(7, 'day')];
        maxAttempts -= 1;
      }

      return solution;
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

const shouldDisableDate = (date: Dayjs) => {
  const today = dayjs();

  if (today.isSame(date, 'month')) {
    return true;
  }
  const nextMonth = today.add(1, 'month').startOf('month');

  if (date.isSame(nextMonth, 'month')) {
    if (date.isSame(nextMonth, 'week')) {
      return true;
    }
    return [10, 11, 12, 16, 18, 29, 30].includes(date.date());
  }
  return false;
};

export default function AdvancedRangeShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        shouldDisableDate={shouldDisableDate}
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
        }}
      />
    </LocalizationProvider>
  );
}
