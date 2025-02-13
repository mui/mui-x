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
      <button
        type="button"
        onClick={() =>
          onActiveSectionChange(activeSection === 'day' ? 'year' : 'day')
        }
        className={styles.SetActiveSectionYearMD2}
      >
        {visibleDate.format('MMMM YYYY')}
        &nbsp; &nbsp;
        {activeSection === 'day' ? '▼' : '▲'}
      </button>
      <div className={styles.HeaderBlock}>
        <Calendar.SetVisibleMonth
          target="previous"
          className={styles.SetVisibleMonth}
          disabled={activeSection !== 'day' ? true : undefined}
        >
          ◀
        </Calendar.SetVisibleMonth>
        <Calendar.SetVisibleMonth
          target="next"
          disabled={activeSection !== 'day' ? true : undefined}
          className={styles.SetVisibleMonth}
        >
          ▶
        </Calendar.SetVisibleMonth>
      </div>
    </header>
  );
}

export default function DateCalendarMD2Demo() {
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
      if (context.section === 'year') {
        handleActiveSectionChange('day');
      }

      setValue(newValue);
    },
    [setValue, handleActiveSectionChange],
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
          onActiveSectionChange={setActiveSection}
        />
        {activeSection === 'year' && (
          <Calendar.YearsGrid
            cellsPerRow={3}
            focusOnMount={hasNavigated}
            className={styles.YearsGrid}
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
          </Calendar.YearsGrid>
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
      </Calendar.Root>
    </LocalizationProvider>
  );
}
