import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function Header(props) {
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
  const [value, setValue] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState('day');
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const handleActiveSectionChange = React.useCallback(
    (newActiveSection) => {
      setActiveSection(newActiveSection);
      setHasNavigated(true);
    },
    [setActiveSection, setHasNavigated],
  );

  const handleValueChange = React.useCallback(
    (newValue, context) => {
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
          <Calendar.YearsList
            focusOnMount={hasNavigated}
            className={styles.YearsList}
          >
            {({ years }) =>
              years.map((year) => (
                <Calendar.YearsCell
                  value={year}
                  className={styles.YearsCell}
                  key={year.toString()}
                />
              ))
            }
          </Calendar.YearsList>
        )}
        {activeSection === 'month' && (
          <Calendar.MonthsList
            focusOnMount={hasNavigated}
            className={styles.MonthsList}
          >
            {({ months }) =>
              months.map((month) => (
                <Calendar.MonthsCell
                  value={month}
                  className={styles.MonthsCell}
                  key={month.toString()}
                />
              ))
            }
          </Calendar.MonthsList>
        )}
        {activeSection === 'day' && (
          <Calendar.DaysGrid focusOnMount={hasNavigated} className={styles.DaysGrid}>
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
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
