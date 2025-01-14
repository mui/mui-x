import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { RangeCalendar } from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from './calendar.module.css';

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
            <RangeCalendar.MonthsGrid cellsPerRow={2} className={styles.MonthsGrid}>
              {({ months }) =>
                months.map((month) => (
                  <RangeCalendar.MonthsCell
                    value={month}
                    className={clsx(styles.MonthsCell, styles.RangeMonthsCell)}
                    key={month.toString()}
                  />
                ))
              }
            </RangeCalendar.MonthsGrid>
          </React.Fragment>
        )}
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
