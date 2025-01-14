import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

const getYearsInDecade: Calendar.YearsGrid.Props['getItems'] = ({ visibleDate }) => {
  const reference = visibleDate.startOf('year');
  const decade = Math.floor(reference.year() / 10) * 10;
  return Array.from({ length: 10 }, (_, index) =>
    reference.set('year', decade + index),
  );
};

export default function YearCalendarWithDecadeNavigationDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root className={styles.Root}>
        {({ visibleDate }) => (
          <React.Fragment>
            <header className={styles.Header}>
              <Calendar.SetVisibleYear
                target={visibleDate.subtract(10, 'years')}
                className={styles.SetVisibleYear}
              >
                ◀
              </Calendar.SetVisibleYear>
              <span>
                {visibleDate
                  .set('year', Math.floor(visibleDate.year() / 10) * 10)
                  .format('YYYY')}
                s
              </span>
              <Calendar.SetVisibleYear
                target={visibleDate.add(10, 'years')}
                className={styles.SetVisibleYear}
              >
                ▶
              </Calendar.SetVisibleYear>
            </header>{' '}
            <Calendar.YearsGrid
              cellsPerRow={2}
              className={styles.YearsGrid}
              getItems={getYearsInDecade}
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
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
