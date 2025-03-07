import * as React from 'react';
import dayjs from 'dayjs';
import NoSsr from '@mui/material/NoSsr';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function FullTimeWithCustomFormatDemo() {
  return (
    <NoSsr>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Clock.Root
          defaultValue={dayjs('2022-04-17T15:30:00')}
          className={styles.Root}
        >
          <Clock.FullTimeList precision="minute" render={<OptionList data-wide />}>
            {({ items }) =>
              items.map((item) => (
                <Clock.Cell
                  key={item.toString()}
                  value={item}
                  format="hh:mm:ss"
                  className={styles.Option}
                />
              ))
            }
          </Clock.FullTimeList>
        </Clock.Root>
      </LocalizationProvider>
    </NoSsr>
  );
}

function OptionList(props) {
  const { children, ...other } = props;

  return (
    <div className={styles.OptionListWrapper} {...other}>
      <div className={styles.OptionListContent}>{children}</div>
    </div>
  );
}
