import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

function Header() {
  const { visibleDate } = useCalendarContext();

  const startOfDecade = React.useMemo(
    () => visibleDate.set('year', Math.floor(visibleDate.year() / 10) * 10),
    [visibleDate],
  );

  return (
    <header className={styles.Header}>
      <Calendar.SetVisibleYear
        target={visibleDate.subtract(10, 'years')}
        className={styles.SetVisibleYear}
      >
        ◀
      </Calendar.SetVisibleYear>
      <span>{startOfDecade.format('YYYY')}s</span>
      <Calendar.SetVisibleYear
        target={visibleDate.add(10, 'years')}
        className={styles.SetVisibleYear}
      >
        ▶
      </Calendar.SetVisibleYear>
    </header>
  );
}

function YearsGrid() {
  const { visibleDate } = useCalendarContext();
  const decade = Math.floor(visibleDate.year() / 10) * 10;

  return (
    <Calendar.YearsGrid cellsPerRow={2} className={styles.YearsGrid}>
      {({ years }) =>
        years
          .filter((year) => Math.floor(year.year() / 10) * 10 === decade)
          .map((year) => (
            <Calendar.YearsCell
              value={year}
              className={styles.YearsCell}
              key={year.toString()}
            />
          ))
      }
    </Calendar.YearsGrid>
  );
}

export default function YearCalendarWithDecadeNavigationDemo() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        <Header />
        <YearsGrid />
      </Calendar.Root>
    </LocalizationProvider>
  );
}
