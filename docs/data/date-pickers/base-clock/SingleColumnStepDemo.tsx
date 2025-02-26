import * as React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import NoSsr from '@mui/material/NoSsr';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function SingleColumnStepDemo() {
  return (
    <NoSsr>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Clock.Root
          defaultValue={dayjs('2022-04-17T15:30:00')}
          className={styles.Root}
        >
          <Clock.Options
            precision="minute"
            step={30}
            className={clsx(styles.OptionList, styles.MultiSectionOptionList)}
          >
            {({ items }) =>
              items.map((item) => (
                <Clock.Option
                  key={item.toString()}
                  value={item}
                  className={styles.Option}
                />
              ))
            }
          </Clock.Options>
        </Clock.Root>
      </LocalizationProvider>
    </NoSsr>
  );
}
