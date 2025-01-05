import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function Header() {
  const { visibleDate, setVisibleDate } = useCalendarContext();

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderBlock}>
        <button
          type="button"
          onClick={() => setVisibleDate(visibleDate.subtract(1, 'month'))}
        >
          ◀
        </button>
        <span className={styles.HeaderMonthLabel}>{visibleDate.format('MMMM')}</span>
        <button
          type="button"
          onClick={() => setVisibleDate(visibleDate.add(1, 'month'))}
        >
          ▶
        </button>
      </div>
      <div className={styles.HeaderBlock}>
        <button
          type="button"
          onClick={() => setVisibleDate(visibleDate.subtract(1, 'year'))}
        >
          ◀
        </button>
        <span>{visibleDate.format('YYYY')}</span>
        <button
          type="button"
          onClick={() => setVisibleDate(visibleDate.add(1, 'year'))}
        >
          ▶
        </button>
      </div>
    </header>
  );
}

export default function DayCalendar() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  const handleValueChange = React.useCallback(
    (newValue: Dayjs | null, context: Calendar.Root.ValueChangeHandlerContext) => {
      console.log(context);
      setValue(newValue);
    },
    [],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={handleValueChange}>
        <div className={styles.Root}>
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
                        <div key={day.toString()} className={styles.DaysCellWrapper}>
                          <Calendar.DaysCell
                            value={day}
                            className={styles.DaysCell}
                          />
                        </div>
                      ))
                    }
                  </Calendar.DaysWeekRow>
                ))
              }
            </Calendar.DaysGridBody>
          </Calendar.DaysGrid>
        </div>
      </Calendar.Root>
    </LocalizationProvider>
  );
}
