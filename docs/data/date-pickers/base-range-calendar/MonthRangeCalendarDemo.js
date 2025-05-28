import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { RangeCalendar } from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from '../base-calendar/calendar.module.css';

export default function MonthRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        {({ visibleDate }) => (
          <React.Fragment>
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
            <RangeCalendar.MonthGrid cellsPerRow={2} className={styles.MonthGrid}>
              {({ months }) =>
                months.map((month) => (
                  <RangeCalendar.MonthCell
                    value={month}
                    className={clsx(styles.MonthCell, styles.RangeMonthCell)}
                    key={month.toString()}
                  />
                ))
              }
            </RangeCalendar.MonthGrid>
          </React.Fragment>
        )}
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
