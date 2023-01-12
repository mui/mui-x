import * as React from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';

const shortcuts = [
  {
    label: 'Christmas Day',
    getValue: ({ adapter }) => {
      // (December 25)
      const today = adapter.date();
      return [
        adapter.setDate(adapter.setMonth(today, 11), 25),
        adapter.setDate(adapter.setMonth(today, 11), 26),
      ];
    },
  },
];

export default function BasicRangeShortcuts() {
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
