'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { useDayList } from '@mui/x-scheduler-headless/use-day-list';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { AgendaViewProps } from './AgendaView.types';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { AgendaEvent } from '../internals/components/event/agenda-event/AgendaEvent';
import './AgendaView.css';

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const { className, ...other } = props;

    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const today = adapter.date();
    const visibleDate = useStore(store, selectors.visibleDate);
    const showWeekends = useStore(store, selectors.showWeekends);

    const getDayList = useDayList();
    const days = React.useMemo(
      () =>
        getDayList({
          date: visibleDate,
          amount: AGENDA_VIEW_DAYS_AMOUNT,
          excludeWeekends: !showWeekends,
        }),
      [getDayList, showWeekends, visibleDate],
    );
    const occurrences = useEventOccurrencesGroupedByDay({ days, renderEventIn: 'every-day' });

    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) =>
        adapter.addDays(date, AGENDA_VIEW_DAYS_AMOUNT * delta),
    }));

    return (
      <div
        ref={handleRef}
        className={clsx('AgendaViewContainer', 'mui-x-scheduler', className)}
        {...other}
      >
        <EventPopoverProvider containerRef={containerRef}>
          {days.map((day) => (
            <section
              className="AgendaViewRow"
              key={day.key}
              id={`AgendaViewRow-${day.key}`}
              aria-labelledby={`DayHeaderCell-${day.key}`}
            >
              <header
                id={`DayHeaderCell-${day.key}`}
                className="DayHeaderCell"
                aria-label={`${adapter.format(day.value, 'weekday')} ${adapter.format(day.value, 'dayOfMonth')}`}
                data-current={adapter.isSameDay(day.value, today) ? '' : undefined}
              >
                <span className="DayNumberCell">{adapter.format(day.value, 'dayOfMonth')}</span>
                <div className="WeekDayCell">
                  <span className={clsx('AgendaWeekDayNameLabel', 'LinesClamp')}>
                    {adapter.format(day.value, 'weekday')}
                  </span>
                  <span className={clsx('AgendaYearAndMonthLabel', 'LinesClamp')}>
                    {adapter.format(day.value, 'month')}, {adapter.format(day.value, 'year')}
                  </span>
                </div>
              </header>
              <ul className="EventsList">
                {occurrences.get(day.key)!.map((occurrence) => (
                  <li key={occurrence.key}>
                    <EventPopoverTrigger
                      occurrence={occurrence}
                      render={
                        <AgendaEvent
                          occurrence={occurrence}
                          ariaLabelledBy={`DayHeaderCell-${day.key}`}
                        />
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </EventPopoverProvider>
      </div>
    );
  }),
);
