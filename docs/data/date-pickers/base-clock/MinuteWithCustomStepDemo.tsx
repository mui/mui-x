import * as React from 'react';
import dayjs from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './clock.module.css';

export default function MinuteWithCustomStepDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Clock.Root
        defaultValue={dayjs('2022-04-17T15:30:00')}
        className={styles.Root}
      >
        <Clock.Hour24List render={<OptionList />}>
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
        <Clock.MinuteList step={5} render={<OptionList />}>
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
      </Clock.Root>
    </LocalizationProvider>
  );
}

function OptionList(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, ...other } = props;

  return (
    <div className={styles.OptionListWrapper} {...other}>
      <div className={styles.OptionListContent}>{children}</div>
    </div>
  );
}
