'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import { DayGrid } from '../../primitives/day-grid';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import { EventPopoverTrigger } from '../internals/components/event-popover';
import { SchedulerValidDate } from '../../primitives/models';
import { isWeekend } from '../internals/utils/date-utils';
import { useTranslations } from '../internals/utils/TranslationsContext';
import { CalendarEvent } from '../models/events';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import './MonthView.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { date, events, maxEvents } = props;
  const adapter = useAdapter();
  const placeholder = DayGrid.useCellPlaceholder(date);
  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const draggedEvent = useSelector(store, selectors.getEventById, placeholder?.id ?? null);
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
  const visibleDate = useSelector(store, selectors.visibleDate);
  const hasDayView = useSelector(store, selectors.hasDayView);
  const today = adapter.date();
  const isFirstDayOfMonth = adapter.isSameDay(date, adapter.startOfMonth(date));

  const eventsWithPlaceholder = React.useMemo(() => {
    if (!draggedEvent || !placeholder) {
      return events;
    }

    const updatedDraggedEvent: CalendarEvent = {
      ...draggedEvent,
      start: placeholder.start,
      end: placeholder.end,
    };

    const draggedEventIndex = events.findIndex((event) => event.id === draggedEvent.id);
    if (draggedEventIndex === -1) {
      return [updatedDraggedEvent, ...events];
    }

    return events.map((event, index) =>
      index === draggedEventIndex ? updatedDraggedEvent : event,
    );
  }, [draggedEvent, placeholder, events]);

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(date, adapter.formats.shortDate)
        : adapter.formatByString(date, adapter.formats.dayOfMonth)}
    </span>
  );

  const isCurrentMonth = adapter.isSameMonth(date, visibleDate);
  const isToday = adapter.isSameDay(date, today);

  const visibleEvents = eventsWithPlaceholder.slice(0, maxEvents);
  const hiddenCount = eventsWithPlaceholder.length - maxEvents;
  return (
    <DayGrid.Cell
      ref={ref}
      value={date}
      className={clsx(
        'MonthViewCell',
        !isCurrentMonth && 'OtherMonth',
        isToday && 'Today',
        isWeekend(adapter, date) && 'Weekend',
      )}
    >
      {hasDayView ? (
        <button
          type="button"
          className="MonthViewCellNumberButton"
          onClick={(event) => instance.switchToDay(date, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </button>
      ) : (
        cellNumberContent
      )}
      {visibleEvents.map((event) => (
        <EventPopoverTrigger
          key={event.id}
          event={event}
          render={
            <DayGridEvent
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="compact"
              ariaLabelledBy={`MonthViewHeaderCell-${date.toString()}`}
            />
          }
        />
      ))}
      {hiddenCount > 0 && eventsWithPlaceholder.length > 0 && (
        <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
      )}
    </DayGrid.Cell>
  );
});

interface MonthViewCellProps {
  date: SchedulerValidDate;
  events: CalendarEvent[];
  maxEvents: number;
}
