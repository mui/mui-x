import * as React from 'react';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
import styles from './calendar.module.css';

export default function MonthCalendarWithCustomCellFormatDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root
        value={value}
        onValueChange={setValue}
        className={clsx(styles.Root, styles.RootShort)}
      >
        {({ visibleDate }) => (
          <React.Fragment>
            <header className={styles.Header}>
              <Calendar.SetVisibleYear
                target="previous"
                className={styles.SetVisibleYear}
              >
                ◀
              </Calendar.SetVisibleYear>
              <span>{visibleDate.format('YYYY')}</span>
              <Calendar.SetVisibleYear
                target="next"
                className={styles.SetVisibleYear}
              >
                ▶
              </Calendar.SetVisibleYear>
            </header>
            <Calendar.MonthsGrid cellsPerRow={3} className={styles.MonthsGrid}>
              {({ months }) =>
                months.map((month) => (
                  <Calendar.MonthsCell
                    value={month}
                    className={styles.MonthsCell}
                    key={month.toString()}
                    format="MMM"
                  />
                ))
              }
            </Calendar.MonthsGrid>
          </React.Fragment>
        )}
      </Calendar.Root>
    </LocalizationProvider>
  );
}
