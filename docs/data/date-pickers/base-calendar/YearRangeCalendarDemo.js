import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { RangeCalendar } from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from './calendar.module.css';

export default function YearRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        <RangeCalendar.YearsGrid cellsPerRow={2} className={styles.YearsGrid}>
          {({ years }) =>
            years.map((year) => (
              <RangeCalendar.YearsCell
                value={year}
                className={clsx(styles.YearsCell, styles.RangeYearsCell)}
                key={year.toString()}
              />
            ))
          }
        </RangeCalendar.YearsGrid>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
