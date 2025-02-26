import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function BasicClockDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs('2022-01-01T14:30:25.000'),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Clock.Root value={value} onValueChange={setValue} className={styles.Root}>
        <Clock.HourOptions className={styles.OptionList}>
          {({ items }) =>
            items.map((item) => (
              <Clock.Option
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.HourOptions>
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
        <Clock.SecondOptions className={styles.OptionList}>
          {({ items }) =>
            items.map((item) => (
              <Clock.Option
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.SecondOptions>
      </Clock.Root>
    </LocalizationProvider>
  );
}
