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
          <RangeCalendar.YearList
            focusOnMount={hasNavigated}
            className={styles.YearList}
          >
            {({ years }) =>
              years.map((year) => (
                <RangeCalendar.SetVisibleYear
                  target={year}
                  key={year.toString()}
                  onClick={() => handleActiveSectionChange('day')}
                  className={styles.YearCell}
                >
                  {year.format('YYYY')}
                </RangeCalendar.SetVisibleYear>
              ))
            }
          </RangeCalendar.YearList>
        )}
        {activeSection === 'month' && (
          <RangeCalendar.MonthList
            focusOnMount={hasNavigated}
            className={styles.MonthList}
          >
            {({ months }) =>
              months.map((month) => (
                <RangeCalendar.SetVisibleMonth
                  target={month}
                  key={month.toString()}
                  onClick={() => handleActiveSectionChange('day')}
                  className={styles.MonthCell}
                >
                  {month.format('MMMM')}
                </RangeCalendar.SetVisibleMonth>
              ))
            }
          </RangeCalendar.MonthList>
        )}
        {activeSection === 'day' && (
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
            <RangeCalendar.DayGridBody
              className={styles.DayGridBody}
              focusOnMount={hasNavigated}
            >
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
        )}
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
