import * as React from 'react';
import dayjs from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function StepMinuteOptions() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Clock.Root
        defaultValue={dayjs('2022-04-17T15:30:00')}
        className={styles.Root}
      >
        <Clock.Hour24Options className={styles.OptionList}>
          {({ items }) =>
            items.map((item) => (
              <Clock.Option
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.Hour24Options>
        <Clock.MinuteOptions step={5} className={styles.OptionList}>
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
    </LocalizationProvider>
  );
}
