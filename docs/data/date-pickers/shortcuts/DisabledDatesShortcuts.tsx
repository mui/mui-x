import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts/PickersShortcuts';

const getMonthWeekday = (
  adapter: any,
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find for exampel the 3rd monday in Jun

  const today = adapter.date();
  const month = adapter.setMonth(today, monthIndex);
  const weeks = adapter.getWeekArray(month);

  let mondayIndex = 0;
  for (let i = 0; i < weeks.length; i += 1) {
    if (adapter.isSameMonth(weeks[i][weekdayIndex], month)) {
      mondayIndex += 1;
    }
    if (mondayIndex === dayRank) {
      return weeks[i][weekdayIndex];
    }
  }
  return null;
};
const shortcuts: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: ({ adapter }) => {
      // (January 1)
      const today = adapter.date();
      return adapter.setDate(adapter.setMonth(today, 0), 1);
    },
  },
  {
    label: 'Birthday of Martin Luther King Jr.',
    getValue: ({ adapter }) => {
      // (third Monday in January)
      return getMonthWeekday(adapter, 0, 0, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: ({ adapter }) => {
      // (July 4)
      const today = adapter.date();
      return adapter.setDate(adapter.setMonth(today, 6), 4);
    },
  },
  {
    label: 'Labor Day',
    getValue: ({ adapter }) => {
      // (first Monday in September)
      return getMonthWeekday(adapter, 8, 0, 1);
    },
  },
  {
    label: 'Columbus Day',
    getValue: ({ adapter }) => {
      // (second Monday in October)
      return getMonthWeekday(adapter, 9, 0, 2);
    },
  },
  {
    label: 'Veterans Day',
    getValue: ({ adapter }) => {
      // (November 11)
      const today = adapter.date();
      return adapter.setDate(adapter.setMonth(today, 10), 11);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: ({ adapter }) => {
      // (fourth Thursday in November)
      return getMonthWeekday(adapter, 10, 3, 4);
    },
  },
  {
    label: 'World AIDS Day',
    getValue: ({ adapter }) => {
      // (December 1)
      const today = adapter.date();
      return adapter.setDate(adapter.setMonth(today, 11), 1);
    },
  },
  {
    label: 'Christmas Day',
    getValue: ({ adapter }) => {
      // (December 25)
      const today = adapter.date();
      return adapter.setDate(adapter.setMonth(today, 11), 25);
    },
  },
];

export default function DisabledDatesShortcuts() {
  const middleDate = dayjs(new Date().setMonth(6));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          shortcuts: {
            shortcuts,
          },
        }}
        minDate={middleDate}
      />
    </LocalizationProvider>
  );
}
