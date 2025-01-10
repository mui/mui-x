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
      <RangeCalendar.SetVisibleMonth
        target="previous"
        className={clsx(styles.SetVisibleMonth)}
      >
        ◀
      </RangeCalendar.SetVisibleMonth>
      <span>{visibleDate.format('MMMM YYYY')}</span>
      <RangeCalendar.SetVisibleMonth
        target="next"
        className={clsx(styles.SetVisibleMonth)}
      >
        ▶
      </RangeCalendar.SetVisibleMonth>
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
                >
                  {year.format('YYYY')}
                </RangeCalendar.SetVisibleYear>
              ))
            }
          </RangeCalendar.YearsList>
        )}
        {/* {activeSection === 'month' && (
           <RangeCalendar.MonthsList className={styles.MonthsList}>
             {({ months }) =>
               months.map((month) => (
                 <RangeCalendar.MonthsCell
                   value={month}
                   className={styles.MonthsCell}
                   key={month.toString()}
                   onClick={() => setActiveSection('day')}
                 >
                   {month.format('MMMM')}
                 </RangeCalendar.MonthsCell>
               ))
             }
           </RangeCalendar.MonthsList>
          )} */}
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
