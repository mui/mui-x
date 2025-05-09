import * as React from 'react';
import clsx from 'clsx';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function DayCalendar(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root
        {...props}
        className={clsx(styles.Root, styles.RootWithWeekNumber)}
      >
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
                {({ days }) => (
                  <React.Fragment>
                    <span
                      role="columnheader"
                      aria-label="Week number"
                      className={styles.DayGridHeaderCell}
                    >
                      #
                    </span>
                    {days.map((day) => (
                      <Calendar.DayGridHeaderCell
                        value={day}
                        key={day.toString()}
                        className={styles.DayGridHeaderCell}
                      />
                    ))}
                  </React.Fragment>
                )}
              </Calendar.DayGridHeader>
              <Calendar.DayGridBody className={styles.DayGridBody}>
                {({ weeks }) =>
                  weeks.map((week) => (
                    <Calendar.DayGridRow
                      value={week}
                      key={week.toString()}
                      className={styles.DayGridRow}
                    >
                      {({ days }) => (
                        <React.Fragment>
                          <span
                            role="rowheader"
                            aria-label={`Week ${days[0].week()}`}
                            className={styles.DayWeekNumber}
                          >
                            {days[0].week()}
                          </span>
                          {days.map((day) => (
                            <Calendar.DayCell
                              value={day}
                              key={day.toString()}
                              className={styles.DayCell}
                            />
                          ))}
                        </React.Fragment>
                      )}
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

export default function DayCalendarWithWeekNumberDemo() {
  const [value, setValue] = React.useState(null);

  const handleValueChange = React.useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DayCalendar value={value} onValueChange={handleValueChange} />
    </LocalizationProvider>
  );
}
