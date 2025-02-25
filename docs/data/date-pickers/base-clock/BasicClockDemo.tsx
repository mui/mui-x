import * as React from 'react';
import { Dayjs } from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function BasicClockDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Clock.Root value={value} onValueChange={setValue} className={styles.Root}>
          <Clock.MinuteOptions className={styles.OptionList}>
            {({ items }) =>
              items.map((item) => (
                <Clock.Option
                  key={item.toString()}
                  value={item}
                  className={styles.Option}
                />
              ))
            }
          </Clock.MinuteOptions>
        </Clock.Root>
        {value == null ? 'null' : value.toString()}
      </div>
    </LocalizationProvider>
  );
}
