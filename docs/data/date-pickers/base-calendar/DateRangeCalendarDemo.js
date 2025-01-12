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

function Header(props) {
  const { activeSection, onActiveSectionChange } = props;
  const { visibleDate } = useRangeCalendarContext();

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderBlock}>
        <RangeCalendar.SetVisibleMonth
          target="previous"
          className={styles.SetVisibleMonth}
          disabled={activeSection !== 'day' ? true : undefined}
        >
          ◀
        </RangeCalendar.SetVisibleMonth>
        <button
          type="button"
          onClick={() =>
            onActiveSectionChange(activeSection === 'month' ? 'day' : 'month')
          }
          disabled={activeSection === 'year' ? true : undefined}
          className={styles.SetActiveSectionMonth}
        >
          {visibleDate.format('MMMM')}
        </button>
        <RangeCalendar.SetVisibleMonth
          target="next"
          disabled={activeSection !== 'day' ? true : undefined}
          className={styles.SetVisibleMonth}
        >
          ▶
        </RangeCalendar.SetVisibleMonth>
      </div>
      <div className={styles.HeaderBlock}>
        <RangeCalendar.SetVisibleYear
          target="previous"
          disabled={activeSection === 'year' ? true : undefined}
          className={styles.SetVisibleYear}
        >
          ◀
        </RangeCalendar.SetVisibleYear>
        <button
          type="button"
          onClick={() =>
            onActiveSectionChange(activeSection === 'year' ? 'day' : 'year')
          }
          className={styles.SetActiveSectionYear}
        >
          {visibleDate.format('YYYY')}
        </button>
        <RangeCalendar.SetVisibleYear
          target="next"
          disabled={activeSection === 'year' ? true : undefined}
          className={styles.SetVisibleYear}
        >
          ▶
        </RangeCalendar.SetVisibleYear>
      </div>
    </header>
  );
}

export default function DateRangeCalendarDemo() {
  const [activeSection, setActiveSection] = React.useState('day');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root monthPageSize={2} className={clsx(styles.Root)}>
        <Header
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
        />
        {activeSection === 'year' && (
          <RangeCalendar.YearsList className={styles.YearsList}>
            {({ years }) =>
              years.map((year) => (
                <RangeCalendar.SetVisibleYear
                  value={year}
                  className={styles.YearsCell}
                  key={year.toString()}
                  onClick={() => setActiveSection('day')}
                  target={year}
                >
                  {year.format('YYYY')}
                </RangeCalendar.SetVisibleYear>
              ))
            }
          </RangeCalendar.YearsList>
        )}
        {activeSection === 'month' && (
          <RangeCalendar.MonthsList className={styles.MonthsList}>
            {({ months }) =>
              months.map((month) => (
                <RangeCalendar.SetVisibleMonth
                  value={month}
                  className={styles.MonthsCell}
                  key={month.toString()}
                  onClick={() => setActiveSection('day')}
                  target={month}
                >
                  {month.format('MMMM')}
                </RangeCalendar.SetVisibleMonth>
              ))
            }
          </RangeCalendar.MonthsList>
        )}
        {activeSection === 'day' && (
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
        )}
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
