import * as React from 'react';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { Separator } from '@base-ui-components/react/separator';
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
      <div className={styles.HeaderPanel}>
        <Calendar.SetVisibleMonth
          target="previous"
          className={clsx(styles.SetVisibleMonth)}
        >
          ◀
        </Calendar.SetVisibleMonth>
        <span>{visibleDate.format('MMMM YYYY')}</span>
        <span />
      </div>
      <div className={styles.HeaderPanel}>
        <span />
        <span>{visibleDate.add(1, 'month').format('MMMM YYYY')}</span>
        <Calendar.SetVisibleMonth
          target="next"
          className={clsx(styles.SetVisibleMonth)}
        >
          ▶
        </Calendar.SetVisibleMonth>
      </div>
    </header>
  );
}

function DaysGrid(props: { offset: 0 | 1 }) {
  const { offset } = props;
  return (
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
  );
}

function DayCalendar(props: Omit<Calendar.Root.Props, 'children'>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root
        {...props}
        monthPageSize={2}
        className={clsx(styles.Root, styles.RootWithTwoPanels)}
      >
        <Header />
        <div className={styles.RootWithTwoPanelsContent}>
          <DaysGrid offset={0} />
          <Separator className={styles.DaysGridSeparator} />
          <DaysGrid offset={1} />
        </div>
      </Calendar.Root>
    </LocalizationProvider>
  );
}

export default function DayCalendarWithTwoMonthsDemo() {
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
