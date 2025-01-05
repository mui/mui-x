import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

export default function YearMonthDayCalendar() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [activeSection, setActiveSection] = React.useState<'day' | 'month' | 'year'>(
    'day',
  );

  const handleValueChange = React.useCallback(
    (newValue: Dayjs | null, context: Calendar.Root.ValueChangeHandlerContext) => {
      if (context.section === 'month') {
        setActiveSection('day');
      }

      if (context.section === 'year') {
        setActiveSection('month');
      }

      setValue(newValue);
    },
    [],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={handleValueChange}>
        <div className={styles.Root}>
          <header className={styles.Header}>Base UI Calendar</header>
          {activeSection === 'year' && (
            <Calendar.YearsList className={styles.YearsList}>
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
            <Calendar.MonthsList className={styles.MonthsList}>
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
                          <div
                            key={day.toString()}
                            className={styles.DaysCellWrapper}
                          >
                            <Calendar.DaysCell
                              value={day}
                              className={styles.DaysCell}
                              disabled={[5, 22, 24].includes(day.date())}
                            />
                          </div>
                        ))
                      }
                    </Calendar.DaysWeekRow>
                  ))
                }
              </Calendar.DaysGridBody>
            </Calendar.DaysGrid>
          )}
        </div>
      </Calendar.Root>
    </LocalizationProvider>
  );
}
