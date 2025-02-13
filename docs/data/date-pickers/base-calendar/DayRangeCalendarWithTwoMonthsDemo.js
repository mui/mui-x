import * as React from 'react';
import clsx from 'clsx';

import { Separator } from '@base-ui-components/react/separator';
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
      <div className={styles.HeaderPanel}>
        <RangeCalendar.SetVisibleMonth
          target="previous"
          className={clsx(styles.SetVisibleMonth)}
        >
          ◀
        </RangeCalendar.SetVisibleMonth>
        <span>{visibleDate.format('MMMM YYYY')}</span>
        <span />
      </div>
      <div className={styles.HeaderPanel}>
        <span />
        <span>{visibleDate.add(1, 'month').format('MMMM YYYY')}</span>
        <RangeCalendar.SetVisibleMonth
          target="next"
          className={clsx(styles.SetVisibleMonth)}
        >
          ▶
        </RangeCalendar.SetVisibleMonth>
      </div>
    </header>
  );
}

function DaysGrid(props) {
  const { offset } = props;
  return (
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
      <RangeCalendar.DaysGridBody className={styles.DaysGridBody} offset={offset}>
        {({ weeks }) =>
          weeks.map((week) => (
            <RangeCalendar.DaysGridRow
              value={week}
              key={week.toString()}
              className={styles.DaysGridRow}
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
            </RangeCalendar.DaysGridRow>
          ))
        }
      </RangeCalendar.DaysGridBody>
    </RangeCalendar.DaysGrid>
  );
}

function DayRangeCalendar(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root
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
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}

export default function DayRangeCalendarWithTwoMonthsDemo() {
  const [value, setValue] = React.useState([null, null]);

  const handleValueChange = React.useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DayRangeCalendar value={value} onValueChange={handleValueChange} />
    </LocalizationProvider>
  );
}
