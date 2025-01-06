import * as React from 'react';
import clsx from 'clsx';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function Header(props) {
  const { offset } = props;
  const { visibleDate } = useCalendarContext();

  const date = visibleDate.add(offset, 'month');

  return (
    <header className={styles.Header}>
      <Calendar.SetVisibleMonth
        target="previous"
        className={clsx(styles.SetVisibleMonth, offset === 1 && styles.Hidden)}
      >
        ◀
      </Calendar.SetVisibleMonth>
      <span>{date.format('MMMM YYYY')}</span>
      <Calendar.SetVisibleMonth
        target="next"
        className={clsx(styles.SetVisibleMonth, offset === 0 && styles.Hidden)}
      >
        ▶
      </Calendar.SetVisibleMonth>
    </header>
  );
}

function DayGrid(props) {
  const { offset } = props;
  return (
    <div className={styles.Panel}>
      <Header offset={offset} />
      <Calendar.DaysGrid className={styles.DaysGrid} offset={offset}>
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
              <Calendar.DaysWeekRow
                value={week}
                key={week.toString()}
                className={styles.DaysWeekRow}
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
              </Calendar.DaysWeekRow>
            ))
          }
        </Calendar.DaysGridBody>
      </Calendar.DaysGrid>
    </div>
  );
}

function DayCalendar(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root {...props} className={clsx(styles.Root, styles.RootTwoPanels)}>
        <DayGrid offset={0} />
        <DayGrid offset={1} />
      </Calendar.Root>
    </LocalizationProvider>
  );
}

export default function DayCalendarTwoMonthsDemo() {
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
