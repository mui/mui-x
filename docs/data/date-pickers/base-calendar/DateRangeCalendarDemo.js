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
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const handleActiveSectionChange = React.useCallback(
    (newActiveSection) => {
      setActiveSection(newActiveSection);
      setHasNavigated(true);
    },
    [setActiveSection, setHasNavigated],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        <Header
          activeSection={activeSection}
          onActiveSectionChange={handleActiveSectionChange}
        />
        {activeSection === 'year' && (
          <RangeCalendar.YearsList
            focusOnMount={hasNavigated}
            className={styles.YearsList}
          >
            {({ years }) =>
              years.map((year) => (
                <RangeCalendar.SetVisibleYear
                  target={year}
                  key={year.toString()}
                  onClick={() => handleActiveSectionChange('day')}
                  className={styles.YearsCell}
                >
                  {year.format('YYYY')}
                </RangeCalendar.SetVisibleYear>
              ))
            }
          </RangeCalendar.YearsList>
        )}
        {activeSection === 'month' && (
          <RangeCalendar.MonthsList
            focusOnMount={hasNavigated}
            className={styles.MonthsList}
          >
            {({ months }) =>
              months.map((month) => (
                <RangeCalendar.SetVisibleMonth
                  target={month}
                  key={month.toString()}
                  onClick={() => handleActiveSectionChange('day')}
                  className={styles.MonthsCell}
                >
                  {month.format('MMMM')}
                </RangeCalendar.SetVisibleMonth>
              ))
            }
          </RangeCalendar.MonthsList>
        )}
        {activeSection === 'day' && (
          <RangeCalendar.DaysGrid
            focusOnMount={hasNavigated}
            className={styles.DaysGrid}
          >
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
