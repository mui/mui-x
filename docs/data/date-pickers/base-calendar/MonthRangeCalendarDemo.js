import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  RangeCalendar,
  useRangeCalendarContext,
} from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from './calendar.module.css';

function Header() {
  const { visibleDate } = useRangeCalendarContext();

  return (
    <header className={styles.Header}>
      <RangeCalendar.SetVisibleYear
        target="previous"
        className={clsx(styles.SetVisibleYear)}
      >
        ◀
      </RangeCalendar.SetVisibleYear>
      <span>{visibleDate.format('YYYY')}</span>
      <RangeCalendar.SetVisibleYear
        target="next"
        className={clsx(styles.SetVisibleYear)}
      >
        ▶
      </RangeCalendar.SetVisibleYear>
    </header>
  );
}

export default function MonthRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root monthPageSize={2} className={clsx(styles.Root)}>
        <Header />
        <RangeCalendar.MonthsGrid cellsPerRow={2} className={styles.MonthsGrid}>
          {({ months }) =>
            months.map((month) => (
              <RangeCalendar.MonthsCell
                value={month}
                className={styles.MonthsCell}
                key={month.toString()}
              />
            ))
          }
        </RangeCalendar.MonthsGrid>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
