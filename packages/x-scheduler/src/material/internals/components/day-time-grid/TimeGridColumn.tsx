'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { TimeGrid } from '../../../../primitives/time-grid';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../../../primitives/utils/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { useOnEveryMinuteStart } from '../../../../primitives/utils/useOnEveryMinuteStart';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '../../../../primitives/use-event-occurrences-with-timeline-position';
import { EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, isToday, showCurrentTimeIndicator, index } = props;

  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const start = React.useMemo(() => adapter.startOfDay(day.value), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day.value), [adapter, day]);

  const placeholder = TimeGrid.usePlaceholderInRange(start, end);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: day.withoutPosition,
    maxColumnSpan: Infinity,
  });

  const draggedOccurrence = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return {
      ...initialDraggedEvent,
      key: `dragged-${initialDraggedEvent.id}`,
      start: placeholder.start,
      end: placeholder.end,
      readOnly: true,
      position: {
        // TODO: Apply the same firstIndex and lastIndex as the initial event if present in the column, 1 / maxIndex otherwise
        firstIndex: 1,
        lastIndex: maxIndex,
      },
    };
  }, [initialDraggedEvent, placeholder, maxIndex]);

  return (
    <TimeGrid.Column
      start={start}
      end={end}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      data-current={isToday ? '' : undefined}
      style={{ '--columns-count': maxIndex } as React.CSSProperties}
    >
      {occurrences.map((occurrence) => (
        <EventPopoverTrigger
          key={occurrence.key}
          occurrence={occurrence}
          render={
            <TimeGridEvent
              occurrence={occurrence}
              variant="regular"
              ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day.value)}`}
            />
          }
        />
      ))}
      {draggedOccurrence != null && (
        <TimeGridEvent
          occurrence={draggedOccurrence}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.key}`}
        />
      )}
      {showCurrentTimeIndicator ? (
        <TimeGrid.CurrentTimeIndicator className="DayTimeGridCurrentTimeIndicator">
          {index === 0 && <TimeGridCurrentTimeLabel />}
        </TimeGrid.CurrentTimeIndicator>
      ) : null}
    </TimeGrid.Column>
  );
}

function TimeGridCurrentTimeLabel() {
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const ampm = useStore(store, selectors.ampm);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const [now, setNow] = React.useState(() => adapter.date());
  useOnEveryMinuteStart(() => setNow(adapter.date()));

  const currentTimeLabel = React.useMemo(
    () => adapter.format(now, timeFormat),
    [now, timeFormat, adapter],
  );

  return (
    <span className="DayTimeGridCurrentTimeLabel" aria-hidden="true">
      {currentTimeLabel}
    </span>
  );
}

interface TimeGridColumnProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  isToday: boolean;
  index: number;
  showCurrentTimeIndicator: boolean;
}
