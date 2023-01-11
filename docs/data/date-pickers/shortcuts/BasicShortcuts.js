import * as React from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';

const getMonthWeekday = (adapter, monthIndex, weekdayIndex, dayRank) => {
  // Helper to find for example the 3rd monday in Jun

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
const shortcuts = [
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
    label: 'Thanksgiving Day',
    getValue: ({ adapter }) => {
      // (fourth Thursday in November)
      return getMonthWeekday(adapter, 10, 3, 4);
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

export default function BasicShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          shortcuts: {
            shortcuts,
          },
        }}
      />
    </LocalizationProvider>
  );
}
