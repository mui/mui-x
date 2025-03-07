import * as React from 'react';
import dayjs from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function Hour24Demo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Clock.Root
        defaultValue={dayjs('2022-04-17T15:30:00')}
        className={styles.Root}
        minTime={dayjs('2022-04-17T09:00:00')}
      >
        <Clock.Hour24List render={<OptionList />} skipInvalidItems>
          {({ items }) =>
            items.map((item) => (
              <Clock.Cell
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.Hour24List>
        <Clock.MinuteList render={<OptionList />}>
          {({ items }) =>
            items.map((item) => (
              <Clock.Cell
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.MinuteList>
        <Clock.SecondList render={<OptionList />}>
          {({ items }) =>
            items.map((item) => (
              <Clock.Cell
                key={item.toString()}
                value={item}
                className={styles.Option}
              />
            ))
          }
        </Clock.SecondList>
      </Clock.Root>
    </LocalizationProvider>
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
