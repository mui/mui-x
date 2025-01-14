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
  );
}

export default function DayRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        <Header />
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
                <RangeCalendar.DaysWeekRow
                  value={week}
                  key={week.toString()}
                  className={styles.DaysWeekRow}
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
                </RangeCalendar.DaysWeekRow>
              ))
            }
          </RangeCalendar.DaysGridBody>
        </RangeCalendar.DaysGrid>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
