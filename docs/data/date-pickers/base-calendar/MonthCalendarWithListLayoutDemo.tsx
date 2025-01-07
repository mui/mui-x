import * as React from 'react';
import { Dayjs } from 'dayjs';
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

  return (
    <header className={styles.Header}>
      <Calendar.SetVisibleYear target="previous" className={styles.SetVisibleYear}>
        ◀
      </Calendar.SetVisibleYear>
      <span>{visibleDate.format('YYYY')}</span>
      <Calendar.SetVisibleYear target="next" className={styles.SetVisibleYear}>
        ▶
      </Calendar.SetVisibleYear>
    </header>
  );
}

export default function MonthCalendarWithListLayoutDemo() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar.Root value={value} onValueChange={setValue} className={styles.Root}>
        <Header />
        <Calendar.MonthsList className={styles.MonthsList}>
          {({ months }) =>
            months.map((month) => (
              <Calendar.MonthsCell
                value={month}
                className={styles.MonthsCell}
                key={month.toString()}
              />
            ))
          }
        </Calendar.MonthsList>
      </Calendar.Root>
    </LocalizationProvider>
  );
}
