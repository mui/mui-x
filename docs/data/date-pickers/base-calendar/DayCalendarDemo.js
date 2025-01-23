import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

export default function DayCalendarDemo() {
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
            <Calendar.DaysGrid className={styles.DaysGrid}>
              <Calendar.DaysGridHeader className={styles.DaysGridHeader}>
                {({ days }) =>
                  days.map((day) => (
                    <Calendar.DaysGridHeaderCell
                      value={day}
                      key={day.toString()}
                      className={styles.DaysGridHeaderCell}
                    />
                  ))
                }
              </Calendar.DaysGridHeader>
              <Calendar.DaysGridBody className={styles.DaysGridBody}>
                {({ weeks }) =>
                  weeks.map((week) => (
                    <Calendar.DaysGridRow
                      value={week}
                      key={week.toString()}
                      className={styles.DaysGridRow}
                    >
                      {({ days }) =>
                        days.map((day) => (
                          <Calendar.DaysCell
                            value={day}
                            key={day.toString()}
                            className={styles.DaysCell}
                          />
                        ))
                      }
                    </Calendar.DaysGridRow>
                  ))
                }
              </Calendar.DaysGridBody>
            </Calendar.DaysGrid>
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
