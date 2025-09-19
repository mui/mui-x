'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { AgendaViewProps } from './AgendaView.types';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { AgendaEvent } from '../internals/components/event/agenda-event/AgendaEvent';
import { CalendarViewConfig } from '../../primitives/models';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { getDayList } from '../../primitives/utils/date-utils';
import './AgendaView.css';

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

const viewConfig: CalendarViewConfig = {
  renderEventIn: 'every-day',
  siblingVisibleDateGetter: ({ adapter, date, delta }) =>
    adapter.addDays(date, AGENDA_VIEW_DAYS_AMOUNT * delta),
  getVisibleDays: ({ adapter, visibleDate, showWeekends }) =>
    getDayList({
      adapter,
      showWeekends,
      firstDay: visibleDate,
      lastDay: adapter.addDays(visibleDate, AGENDA_VIEW_DAYS_AMOUNT),
    }),
};

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const occurrencesMap = useStore(store, selectors.occurrencesByDayMap);
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const { className, ...other } = props;
    const today = adapter.date();

    const { days } = useInitializeView(viewConfig);

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
                {occurrencesMap.get(day.key)!.map((occurrence) => (
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
