import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  RangeCalendar,
  useRangeCalendarContext,
} from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from '../base-calendar/calendar.module.css';

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

export default function DayRangeCalendarWithoutPreviewDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)} disableHoverPreview>
        <Header />
        <RangeCalendar.DayGrid className={styles.DayGrid}>
          <RangeCalendar.DayGridHeader className={styles.DayGridHeader}>
            {({ days }) =>
              days.map((day) => (
                <RangeCalendar.DayGridHeaderCell
                  value={day}
                  key={day.toString()}
                  className={styles.DayGridHeaderCell}
                />
              ))
            }
          </RangeCalendar.DayGridHeader>
          <RangeCalendar.DayGridBody className={styles.DayGridBody}>
            {({ weeks }) =>
              weeks.map((week) => (
                <RangeCalendar.DayGridRow
                  value={week}
                  key={week.toString()}
                  className={styles.DayGridRow}
                >
                  {({ days }) =>
                    days.map((day) => (
                      <RangeCalendar.DayCell
                        value={day}
                        key={day.toString()}
                        className={clsx(styles.DayCell, styles.RangeDayCell)}
                      />
                    ))
                  }
                </RangeCalendar.DayGridRow>
              ))
            }
          </RangeCalendar.DayGridBody>
        </RangeCalendar.DayGrid>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
