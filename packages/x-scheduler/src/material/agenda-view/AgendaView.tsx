'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { AgendaViewProps } from './AgendaView.types';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useEventOccurrencesGroupedByDay } from '../../primitives/use-event-occurrences-grouped-by-day';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { AgendaEvent } from '../internals/components/event/agenda-event/AgendaEvent';
import './AgendaView.css';

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

const adapter = getAdapter();

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const { className, ...other } = props;
    const store = useEventCalendarStoreContext();
    const today = adapter.date();
    const visibleDate = useStore(store, selectors.visibleDate);
    const preferences = useStore(store, selectors.preferences);

    const getDayList = useDayList();
    const days = React.useMemo(
      () =>
        getDayList({
          date: visibleDate,
          amount: AGENDA_VIEW_DAYS_AMOUNT,
          excludeWeekends: !preferences.showWeekends,
        }),
      [getDayList, preferences.showWeekends, visibleDate],
    );
    const occurrences = useEventOccurrencesGroupedByDay({ days, renderEventIn: 'every-day' });

    useInitializeView(() => ({
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
                  <li>
                    <EventPopoverTrigger
                      key={occurrence.key}
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
