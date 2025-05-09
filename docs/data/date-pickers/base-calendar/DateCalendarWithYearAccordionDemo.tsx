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

function Header(props: {
  activeSection: 'day' | 'month';
  onActiveSectionChange: (newActiveSection: 'day' | 'month') => void;
}) {
  const { activeSection, onActiveSectionChange } = props;
  const { visibleDate } = useCalendarContext();

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderBlock}>
        <button
          type="button"
          onClick={() =>
            onActiveSectionChange(activeSection === 'month' ? 'day' : 'month')
          }
          className={styles.SetActiveSectionYearMD2}
        >
          {visibleDate.format('YYYY MMMM')}
          &nbsp; &nbsp;
          {activeSection === 'day' ? '▼' : '▲'}
        </button>
      </div>
      <div className={styles.HeaderBlock}>
        <Calendar.SetVisibleMonth
          target="previous"
          className={styles.SetVisibleMonth}
        >
          ◀
        </Calendar.SetVisibleMonth>
        <Calendar.SetVisibleMonth target="next" className={styles.SetVisibleMonth}>
          ▶
        </Calendar.SetVisibleMonth>
      </div>
    </header>
  );
}

export default function DateCalendarWithYearAccordionDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [activeSection, setActiveSection] = React.useState<'day' | 'month'>('month');
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const handleActiveSectionChange = React.useCallback(
    (newActiveSection: 'day' | 'month') => {
      setActiveSection(newActiveSection);
      setHasNavigated(true);
    },
    [setActiveSection, setHasNavigated],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        {({ visibleDate }) => (
          <React.Fragment>
            <Header
              activeSection={activeSection}
              onActiveSectionChange={handleActiveSectionChange}
            />
            {activeSection === 'month' && (
              <Calendar.YearList className={styles.YearAccordionRoot}>
                {({ years }) =>
                  years.map((year, yearIndex) => (
                    <React.Fragment key={year.toString()}>
                      {yearIndex > 0 && (
                        <Separator className={styles.YearAccordionSeparator} />
                      )}
                      <Calendar.SetVisibleYear
                        target={year}
                        className={styles.YearAccordionTrigger}
                      >
                        {year.format('YYYY')}
                      </Calendar.SetVisibleYear>
                      {visibleDate.format('YYYY') === year.format('YYYY') && (
                        <Calendar.MonthGrid
                          cellsPerRow={3}
                          focusOnMount={hasNavigated}
                          className={clsx(
                            styles.MonthGrid,
                            styles.YearAccordionPanel,
                          )}
                        >
                          {({ months }) =>
                            months.map((month) => (
                              <Calendar.SetVisibleMonth
                                target={month}
                                className={styles.MonthCell}
                                key={month.toString()}
                                onClick={() => handleActiveSectionChange('day')}
                              >
                                {month.format('MMM')}
                              </Calendar.SetVisibleMonth>
                            ))
                          }
                        </Calendar.MonthGrid>
                      )}
                    </React.Fragment>
                  ))
                }
              </Calendar.YearList>
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
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
