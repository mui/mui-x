import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

const getYears = ({ getDefaultItems }) => {
  return getDefaultItems().toReversed();
};

export default function YearCalendarWithReversedOrderDemo() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        <Calendar.YearGrid
          cellsPerRow={3}
          className={styles.YearGrid}
          getItems={getYears}
        >
          {({ years }) =>
            years.map((year) => (
              <Calendar.YearCell
                value={year}
                className={styles.YearCell}
                key={year.toString()}
              />
            ))
          }
        </Calendar.YearGrid>
      </Calendar.Root>
    </LocalizationProvider>
  );
}
