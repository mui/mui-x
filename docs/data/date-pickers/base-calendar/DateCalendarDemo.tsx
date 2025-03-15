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

function Header(props: {
  activeSection: 'day' | 'month' | 'year';
  onActiveSectionChange: (newActiveSection: 'day' | 'month' | 'year') => void;
}) {
  const { activeSection, onActiveSectionChange } = props;
  const { visibleDate } = useCalendarContext();

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderBlock}>
        <Calendar.SetVisibleMonth
          target="previous"
          className={styles.SetVisibleMonth}
          disabled={activeSection !== 'day' ? true : undefined}
        >
          ◀
        </Calendar.SetVisibleMonth>
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
        <Calendar.SetVisibleMonth
          target="next"
          disabled={activeSection !== 'day' ? true : undefined}
          className={styles.SetVisibleMonth}
        >
          ▶
        </Calendar.SetVisibleMonth>
      </div>
      <div className={styles.HeaderBlock}>
        <Calendar.SetVisibleYear
          target="previous"
          disabled={activeSection === 'year' ? true : undefined}
          className={styles.SetVisibleYear}
        >
          ◀
        </Calendar.SetVisibleYear>
        <button
          type="button"
          onClick={() =>
            onActiveSectionChange(activeSection === 'year' ? 'day' : 'year')
          }
          className={styles.SetActiveSectionYear}
        >
          {visibleDate.format('YYYY')}
        </button>
        <Calendar.SetVisibleYear
          target="next"
          disabled={activeSection === 'year' ? true : undefined}
          className={styles.SetVisibleYear}
        >
          ▶
        </Calendar.SetVisibleYear>
      </div>
    </header>
  );
}

export default function DateCalendarDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [activeSection, setActiveSection] = React.useState<'day' | 'month' | 'year'>(
    'day',
  );
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const handleActiveSectionChange = React.useCallback(
    (newActiveSection: 'day' | 'month' | 'year') => {
      setActiveSection(newActiveSection);
      setHasNavigated(true);
    },
    [setActiveSection, setHasNavigated],
  );

  const handleValueChange = React.useCallback(
    (newValue: Dayjs | null, context: Calendar.Root.ValueChangeHandlerContext) => {
      if (context.section === 'month' || context.section === 'year') {
        handleActiveSectionChange('day');
      }

      setValue(newValue);
    },
    [handleActiveSectionChange],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root
        value={value}
        onValueChange={handleValueChange}
        className={styles.Root}
      >
        <Header
          activeSection={activeSection}
          onActiveSectionChange={handleActiveSectionChange}
        />
        {activeSection === 'year' && (
          <Calendar.YearList focusOnMount={hasNavigated} className={styles.YearList}>
            {({ years }) =>
              years.map((year) => (
                <Calendar.YearCell
                  value={year}
                  className={styles.YearCell}
                  key={year.toString()}
                />
              ))
            }
          </Calendar.YearList>
        )}
        {activeSection === 'month' && (
          <Calendar.MonthList
            focusOnMount={hasNavigated}
            className={styles.MonthList}
          >
            {({ months }) =>
              months.map((month) => (
                <Calendar.MonthCell
                  value={month}
                  className={styles.MonthCell}
                  key={month.toString()}
                />
              ))
            }
          </Calendar.MonthList>
        )}
        {activeSection === 'day' && (
          <Calendar.DayGrid className={styles.DayGrid}>
            <Calendar.DayGridHeader className={styles.DayGridHeader}>
              {({ days }) =>
                days.map((day) => (
                  <Calendar.DayGridHeaderCell
                    value={day}
                    key={day.toString()}
                    className={styles.DayGridHeaderCell}
                  />
                ))
              }
            </Calendar.DayGridHeader>
            <Calendar.DayGridBody
              className={styles.DayGridBody}
              focusOnMount={hasNavigated}
            >
              {({ weeks }) =>
                weeks.map((week) => (
                  <Calendar.DayGridRow
                    value={week}
                    key={week.toString()}
                    className={styles.DayGridRow}
                  >
                    {({ days }) =>
                      days.map((day) => (
                        <Calendar.DayCell
                          value={day}
                          key={day.toString()}
                          className={styles.DayCell}
                        />
                      ))
                    }
                  </Calendar.DayGridRow>
                ))
              }
            </Calendar.DayGridBody>
          </Calendar.DayGrid>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
