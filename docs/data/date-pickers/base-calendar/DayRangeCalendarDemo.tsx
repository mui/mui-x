import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { RangeCalendar } from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from './calendar.module.css';

export default function DayRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        {({ visibleDate }) => (
          <React.Fragment>
            <header className={styles.Header}>
              <RangeCalendar.SetVisibleMonth
                target="previous"
                className={clsx(styles.SetVisibleMonth)}
              >
                ◀
              </RangeCalendar.SetVisibleMonth>
              <span>{visibleDate.format('MMMM YYYY')}</span>
              <RangeCalendar.SetVisibleMonth
                target="next"
                className={clsx(styles.SetVisibleMonth)}
              >
                ▶
              </RangeCalendar.SetVisibleMonth>
            </header>
            <RangeCalendar.DaysGrid className={styles.DaysGrid}>
              <RangeCalendar.DaysGridHeader className={styles.DaysGridHeader}>
                {({ days }) =>
                  days.map((day) => (
                    <RangeCalendar.DaysGridHeaderCell
                      value={day}
                      key={day.toString()}
                      className={styles.DaysGridHeaderCell}
                    />
                  ))
                }
              </RangeCalendar.DaysGridHeader>
              <RangeCalendar.DaysGridBody className={styles.DaysGridBody}>
                {({ weeks }) =>
                  weeks.map((week) => (
                    <RangeCalendar.DaysGridRow
                      value={week}
                      key={week.toString()}
                      className={styles.DaysGridRow}
                    >
                      {({ days }) =>
                        days.map((day) => (
                          <RangeCalendar.DaysCell
                            value={day}
                            key={day.toString()}
                            className={clsx(styles.DaysCell, styles.RangeDaysCell)}
                          />
                        ))
                      }
                    </RangeCalendar.DaysGridRow>
                  ))
                }
              </RangeCalendar.DaysGridBody>
            </RangeCalendar.DaysGrid>
          </React.Fragment>
        )}
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
