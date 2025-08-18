'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEvent, SchedulerValidDate } from '../../../primitives/models';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useEventCalendarContext } from '../../internals/hooks/useEventCalendarContext';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { isWeekend } from '../../../primitives/utils/date-utils';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { selectors } from '../../../primitives/use-event-calendar';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, events, maxEvents } = props;
  const adapter = useAdapter();
  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const placeholder = DayGrid.useCellPlaceholder(day);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const draggedEvent = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);

  const isCurrentMonth = adapter.isSameMonth(day, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day, adapter.startOfMonth(day));
  const isToday = React.useMemo(() => adapter.isSameDay(day, adapter.date()), [adapter, day]);

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

  const visibleEvents = eventsWithPlaceholder.slice(0, maxEvents);
  const hiddenCount = eventsWithPlaceholder.length - maxEvents;

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(day, adapter.formats.shortDate)
        : adapter.formatByString(day, adapter.formats.dayOfMonth)}
    </span>
  );

  return (
    <DayGrid.Cell
      ref={ref}
      key={day.toString()}
      className={clsx(
        'MonthViewCell',
        !isCurrentMonth && 'OtherMonth',
        isToday && 'Today',
        isWeekend(adapter, day) && 'Weekend',
      )}
      value={day}
    >
      {hasDayView ? (
        <button
          type="button"
          className="MonthViewCellNumberButton"
          onClick={(event) => instance.switchToDay(day, event)}
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
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
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
  day: SchedulerValidDate;
  events: CalendarEvent[];
  maxEvents: number;
}
