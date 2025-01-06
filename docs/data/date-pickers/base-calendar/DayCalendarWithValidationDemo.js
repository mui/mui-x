import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function Header() {
  const { visibleDate } = useCalendarContext();

  return (
    <header className={styles.Header}>
      <Calendar.SetVisibleMonth target="previous" className={styles.SetVisibleMonth}>
        ◀
      </Calendar.SetVisibleMonth>
      <span>{visibleDate.format('MMMM YYYY')}</span>
      <Calendar.SetVisibleMonth target="next" className={styles.SetVisibleMonth}>
        ▶
      </Calendar.SetVisibleMonth>
    </header>
  );
}

function DayCalendar(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root {...props} className={styles.Root}>
        <Header />
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
      </Calendar.Root>
    </LocalizationProvider>
  );
}

const ALREADY_BOOKED_NIGHTS = [
  dayjs().add(3, 'day'),
  dayjs().add(8, 'day'),
  dayjs().add(9, 'day'),
  dayjs().add(10, 'day'),
  dayjs().add(13, 'day'),
  dayjs().add(14, 'day'),
  dayjs().add(15, 'day'),
  dayjs().add(16, 'day'),
  dayjs().add(17, 'day'),
];

const ALREADY_BOOKED_NIGHTS_SET = new Set(
  ALREADY_BOOKED_NIGHTS.map((date) => date.format('YYYY-MM-DD')),
);

export default function DayCalendarWithValidationDemo() {
  const [value, setValue] = React.useState(null);

  const handleValueChange = React.useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DayCalendar
        value={value}
        onValueChange={handleValueChange}
        disablePast
        shouldDisableDate={(date) =>
          ALREADY_BOOKED_NIGHTS_SET.has(date.format('YYYY-MM-DD'))
        }
      />
    </LocalizationProvider>
  );
}
