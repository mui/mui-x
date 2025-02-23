import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BasicClockDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Clock.Root>
        <Clock.MinuteOptions>
          {({ items }) =>
            items.map((item) => <Clock.Option key={item.toString()} value={item} />)
          }
        </Clock.MinuteOptions>
      </Clock.Root>
    </LocalizationProvider>
  );
}
