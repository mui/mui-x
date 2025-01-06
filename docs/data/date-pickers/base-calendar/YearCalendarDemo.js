import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

export default function YearCalendarDemo() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        <Calendar.YearsGrid cellsPerRow={2} className={styles.YearsGrid}>
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
      </Calendar.Root>
    </LocalizationProvider>
  );
}
