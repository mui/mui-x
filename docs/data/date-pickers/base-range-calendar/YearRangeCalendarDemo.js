import * as React from 'react';
import clsx from 'clsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { RangeCalendar } from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from '../base-calendar/calendar.module.css';

export default function YearRangeCalendarDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RangeCalendar.Root className={clsx(styles.Root)}>
        <RangeCalendar.YearGrid cellsPerRow={2} className={styles.YearGrid}>
          {({ years }) =>
            years.map((year) => (
              <RangeCalendar.YearCell
                value={year}
                className={clsx(styles.YearCell, styles.RangeYearCell)}
                key={year.toString()}
              />
            ))
          }
        </RangeCalendar.YearGrid>
      </RangeCalendar.Root>
    </LocalizationProvider>
  );
}
