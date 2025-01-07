import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  RangeCalendar,
  // useRangeCalendarContext,
} from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from './calendar.module.css';

function Header() {
  // const { visibleDate } = useRangeCalendarContext();

  return (
    <header className={styles.Header}>
      {/* <RangeCalendar.SetVisibleMonth target="previous" className={styles.SetVisibleMonth}>
        ◀
      </RangeCalendar.SetVisibleMonth>
      <span>{visibleDate.format('MMMM YYYY')}</span>
      <RangeCalendar.SetVisibleMonth target="next" className={styles.SetVisibleMonth}>
        ▶
      </RangeCalendar.SetVisibleMonth> */}
    </header>
  );
}

function DayCalendar(props: Omit<RangeCalendar.Root.Props, 'children'>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root {...props} className={styles.Root}>
        <Header />
        <RangeCalendar.DaysGrid className={styles.DaysGrid}>
          {/* <RangeCalendar.DaysGridHeader className={styles.DaysGridHeader}>
            {({ days }) =>
              days.map((day) => (
                <RangeCalendar.DaysGridHeaderCell
                  value={day}
                  key={day.toString()}
                  className={styles.DaysGridHeaderCell}
                />
              ))
            }
          </RangeCalendar.DaysGridHeader> */}
          <RangeCalendar.DaysGridBody className={styles.DaysGridBody}>
            {({ weeks }) =>
              weeks.map((week) => (
                <RangeCalendar.DaysWeekRow
                  value={week}
                  key={week.toString()}
                  className={styles.DaysWeekRow}
                >
                  {/* {({ days }) =>
                    days.map((day) => (
                      <RangeCalendar.DaysCell
                        value={day}
                        key={day.toString()}
                        className={styles.DaysCell}
                      />
                    ))
                  } */}
                  {({ days }) =>
                    days.map((day) => (
                      <button type="button" className={styles.DaysCell}>
                        {day.format('D')}
                      </button>
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

export default function DayRangeCalendarDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  const handleValueChange = React.useCallback((newValue: Dayjs | null) => {
    setValue(newValue);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DayCalendar value={value} onValueChange={handleValueChange} />
    </LocalizationProvider>
  );
}
