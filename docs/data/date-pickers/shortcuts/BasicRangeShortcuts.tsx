import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro';

const i18n = {
  thisWeek: 'This Week',
  lastWeek: 'Last Week',
  last7Days: 'Last 7 Days',
  currentMonth: 'Current Month',
  nextMonth: 'Next Month',
  reset: 'Reset',
};

const valueGetter: {
  [key in keyof typeof i18n]: PickersShortcutsItem<
    DateRange<unknown>,
    unknown
  >['getValue'];
} = {
  thisWeek: ({ adapter }) => {
    const today = adapter.date()!;
    return [adapter.startOfWeek(today), adapter.endOfWeek(today)];
  },
  lastWeek: ({ adapter }) => {
    const today = adapter.date()!;
    const prevWeek = adapter.addDays(today, -7);
    return [adapter.startOfWeek(prevWeek), adapter.endOfWeek(prevWeek)];
  },
  last7Days: ({ adapter }) => {
    const today = adapter.date()!;
    return [adapter.addDays(today, -7), today];
  },
  currentMonth: ({ adapter }) => {
    const today = adapter.date()!;
    return [adapter.startOfMonth(today), adapter.endOfMonth(today)];
  },
  nextMonth: ({ adapter }) => {
    const today = adapter.date()!;
    const startOfNextMonth = adapter.addDays(adapter.endOfMonth(today), 1);
    return [startOfNextMonth, adapter.endOfMonth(startOfNextMonth)];
  },
  reset: () => [null, null],
};
const useRangeShortcuts = (shortcutKeys: (keyof typeof i18n)[]) => {
  return shortcutKeys.map((key) => ({
    getValue: valueGetter[key],
    label: i18n[key],
  }));
};

export default function BasicRangeShortcuts() {
  const shortcuts = useRangeShortcuts([
    'thisWeek',
    'lastWeek',
    'last7Days',
    'currentMonth',
    'nextMonth',
    'reset',
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDateRangePicker
        componentsProps={{
          shortcuts: {
            shortcuts,
          },
        }}
      />
    </LocalizationProvider>
  );
}
