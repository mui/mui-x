import * as React from 'react';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Separator } from '@base-ui-components/react/separator';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import {
  RangeCalendar,
  useRangeCalendarContext,
} from '@mui/x-date-pickers-pro/internals/base/RangeCalendar';
import styles from '../base-calendar/calendar.module.css';

/**
 * Fake server request to fetch the booked dates for the visible range.
 * @param {Dayjs} month The month to fetch the booked dates for.
 * @returns {Promise<Dayjs[]>} The booked dates for the visible range.
 */
async function fetchBookedDates(month: Dayjs) {
  const BOOKED_NIGHTS = [
    dayjs().add(3, 'day'),
    dayjs().add(8, 'day'),
    dayjs().add(9, 'day'),
    dayjs().add(10, 'day'),
    dayjs().add(13, 'day'),
    dayjs().add(14, 'day'),
    dayjs().add(15, 'day'),
    dayjs().add(16, 'day'),
    dayjs().add(17, 'day'),
    dayjs().add(27, 'day'),
    dayjs().add(28, 'day'),
    dayjs().add(29, 'day'),
    dayjs().add(30, 'day'),
    dayjs().add(45, 'day'),
    dayjs().add(46, 'day'),
    dayjs().add(48, 'day'),
    dayjs().add(49, 'day'),
    dayjs().add(80, 'day'),
    dayjs().add(81, 'day'),
    dayjs().add(82, 'day'),
    dayjs().add(83, 'day'),
    dayjs().add(84, 'day'),
    dayjs().add(85, 'day'),
    dayjs().add(86, 'day'),
    dayjs().add(92, 'day'),
    dayjs().add(93, 'day'),
    dayjs().add(100, 'day'),
  ];

  return new Promise<Set<string>>((resolve) => {
    setTimeout(
      () => {
        const startOfVisibleRange = month.startOf('month').startOf('week');
        const endOfVisibleRange = month.add(1, 'month').endOf('month').endOf('week');
        const bookedDates = BOOKED_NIGHTS.filter(
          (date) =>
            date.isAfter(startOfVisibleRange) && date.isBefore(endOfVisibleRange),
        ).map((date) => date.format('YYYY-MM-DD'));

        resolve(new Set(bookedDates));
      },
      // Fake latency between 300ms and 600ms
      Math.floor(300 + Math.random() * 300),
    );
  });
}

function useBookedDates(visibleDate: Dayjs) {
  return useQuery({
    queryKey: ['bookedDates', visibleDate.format('MM YYYY')],
    queryFn: () => fetchBookedDates(visibleDate),
  });
}

function Header() {
  const { visibleDate } = useRangeCalendarContext();

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderPanel}>
        <RangeCalendar.SetVisibleMonth
          target="previous"
          className={clsx(styles.SetVisibleMonth)}
        >
          ◀
        </RangeCalendar.SetVisibleMonth>
        <span>{visibleDate.format('MMMM YYYY')}</span>
        <span />
      </div>
      <div className={styles.HeaderPanel}>
        <span />
        <span>{visibleDate.add(1, 'month').format('MMMM YYYY')}</span>
        <RangeCalendar.SetVisibleMonth
          target="next"
          className={clsx(styles.SetVisibleMonth)}
        >
          ▶
        </RangeCalendar.SetVisibleMonth>
      </div>
    </header>
  );
}

function DayGrid(props: { offset: 0 | 1 }) {
  const { offset } = props;
  const { visibleDate } = useRangeCalendarContext();
  const bookedDates = useBookedDates(visibleDate);

  return (
    <RangeCalendar.DayGrid className={styles.DayGrid}>
      <RangeCalendar.DayGridHeader className={styles.DayGridHeader}>
        {({ days }) =>
          days.map((day) => (
            <RangeCalendar.DayGridHeaderCell
              value={day}
              key={day.toString()}
              className={styles.DayGridHeaderCell}
            />
          ))
        }
      </RangeCalendar.DayGridHeader>
      <RangeCalendar.DayGridBody className={styles.DayGridBody} offset={offset}>
        {({ weeks }) =>
          weeks.map((week) => (
            <RangeCalendar.DayGridRow
              value={week}
              key={week.toString()}
              className={styles.DayGridRow}
            >
              {({ days }) =>
                days.map((day) => (
                  <RangeCalendar.DayCell
                    value={day}
                    key={day.toString()}
                    className={clsx(styles.DayCell, styles.RangeDayCell)}
                    // TODO: Passing `disabled: undefined` should keep the built-in behavior
                    {...(bookedDates.isLoading ? { disabled: true } : undefined)}
                  />
                ))
              }
            </RangeCalendar.DayGridRow>
          ))
        }
      </RangeCalendar.DayGridBody>
    </RangeCalendar.DayGrid>
  );
}

function BookingCalendar() {
  const [visibleDate, setVisibleDate] = React.useState(() => dayjs());
  const bookedDates = useBookedDates(visibleDate);

  const shouldDisableDate = React.useCallback(
    (date: Dayjs) => {
      return bookedDates.data?.has(date.format('YYYY-MM-DD')) ?? false;
    },
    [bookedDates.data],
  );

  const maxDate = React.useMemo(() => dayjs().add(1, 'year').endOf('year'), []);

  return (
    <RangeCalendar.Root
      monthPageSize={2}
      visibleDate={visibleDate}
      onVisibleDateChange={setVisibleDate}
      disablePast
      maxDate={maxDate}
      shouldDisableDate={shouldDisableDate}
      className={clsx(styles.Root, styles.RootWithTwoPanels)}
    >
      <Header />
      <div className={styles.RootWithTwoPanelsContent}>
        <DayGrid offset={0} />
        <Separator className={styles.DayGridSeparator} />
        <DayGrid offset={1} />
      </div>
    </RangeCalendar.Root>
  );
}

const queryClient = new QueryClient();

export default function DayRangeCalendarAirbnbRecipe() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <BookingCalendar />
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
