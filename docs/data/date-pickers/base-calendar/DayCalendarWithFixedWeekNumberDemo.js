import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

export default function DayCalendarWithFixedWeekNumberDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root className={styles.Root}>
        {({ visibleDate }) => (
          <React.Fragment>
            <header className={styles.Header}>
              <Calendar.SetVisibleMonth
                target="previous"
                className={styles.SetVisibleMonth}
              >
                ◀
              </Calendar.SetVisibleMonth>
              <span>{visibleDate.format('MMMM YYYY')}</span>
              <Calendar.SetVisibleMonth
                target="next"
                className={styles.SetVisibleMonth}
              >
                ▶
              </Calendar.SetVisibleMonth>
            </header>
            <Calendar.DayGrid className={styles.DayGrid}>
              <Calendar.DayGridHeader className={styles.DayGridHeader}>
                {({ days }) =>
                  days.map((day) => (
                    <Calendar.DayGridHeaderCell
                      value={day}
                      key={day.toString()}
                      className={styles.DayGridHeaderCell}
                    />
                  ))
                }
              </Calendar.DayGridHeader>
              <Calendar.DayGridBody
                className={styles.DayGridBody}
                fixedWeekNumber={6}
              >
                {({ weeks }) =>
                  weeks.map((week) => (
                    <Calendar.DayGridRow
                      value={week}
                      key={week.toString()}
                      className={styles.DayGridRow}
                    >
                      {({ days }) =>
                        days.map((day) => (
                          <Calendar.DayCell
                            value={day}
                            key={day.toString()}
                            className={styles.DayCell}
                          />
                        ))
                      }
                    </Calendar.DayGridRow>
                  ))
                }
              </Calendar.DayGridBody>
            </Calendar.DayGrid>
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
