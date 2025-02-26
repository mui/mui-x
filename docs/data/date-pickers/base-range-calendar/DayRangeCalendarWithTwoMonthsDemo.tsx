import * as React from 'react';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { Separator } from '@base-ui-components/react/separator';
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

function DayGrid(props: { offset: 0 | 1 }) {
  const { offset } = props;
  return (
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
      <RangeCalendar.DayGridBody className={styles.DayGridBody} offset={offset}>
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
  );
}

function DayRangeCalendar(props: Omit<RangeCalendar.Root.Props, 'children'>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root
        {...props}
        monthPageSize={2}
        className={clsx(styles.Root, styles.RootWithTwoPanels)}
      >
        <Header />
        <div className={styles.RootWithTwoPanelsContent}>
          <DayGrid offset={0} />
          <Separator className={styles.DayGridSeparator} />
          <DayGrid offset={1} />
        </div>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}

export default function DayRangeCalendarWithTwoMonthsDemo() {
  const [value, setValue] = React.useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const handleValueChange = React.useCallback(
    (newValue: [Dayjs | null, Dayjs | null]) => {
      setValue(newValue);
    },
    [],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DayRangeCalendar value={value} onValueChange={handleValueChange} />
    </LocalizationProvider>
  );
}
