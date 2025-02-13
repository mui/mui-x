import * as React from 'react';
import clsx from 'clsx';

import { Separator } from '@base-ui-components/react/separator';
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
  const [value, setValue] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState('month');
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
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        {({ visibleDate }) => (
          <React.Fragment>
            <Header
              activeSection={activeSection}
              onActiveSectionChange={handleActiveSectionChange}
            />
            {activeSection === 'month' && (
              <Calendar.YearsList className={styles.YearAccordionRoot}>
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
                        <Calendar.MonthsGrid
                          cellsPerRow={3}
                          focusOnMount={hasNavigated}
                          className={clsx(
                            styles.MonthsGrid,
                            styles.YearAccordionPanel,
                          )}
                        >
                          {({ months }) =>
                            months.map((month) => (
                              <Calendar.SetVisibleMonth
                                target={month}
                                className={styles.MonthsCell}
                                key={month.toString()}
                                onClick={() => handleActiveSectionChange('day')}
                              >
                                {month.format('MMM')}
                              </Calendar.SetVisibleMonth>
                            ))
                          }
                        </Calendar.MonthsGrid>
                      )}
                    </React.Fragment>
                  ))
                }
              </Calendar.YearsList>
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
                <Calendar.DaysGridBody
                  className={styles.DaysGridBody}
                  focusOnMount={hasNavigated}
                >
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
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
