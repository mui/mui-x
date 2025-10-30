'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarEventSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { EventDragPreview } from '../../event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import './TimeGridEvent.css';
import '../index.css';

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, className, variant, ...other } = props;

  const store = useEventCalendarStoreContext();
  const adapter = useAdapter();
  const isRecurring = Boolean(occurrence.rrule);
  const isDraggable = useStore(store, eventCalendarEventSelectors.isDraggable, occurrence.id);
  const isResizable = useStore(
    store,
    eventCalendarEventSelectors.isResizable,
    occurrence.id,
    'time-grid',
  );
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);
  const formatTime = useFormatTime();

  const durationMs =
    adapter.toJsDate(occurrence.end).getTime() - adapter.toJsDate(occurrence.start).getTime();
  const durationMinutes = durationMs / 60000;
  const isBetween30and60Minutes = durationMinutes >= 30 && durationMinutes < 60;
  const isLessThan30Minutes = durationMinutes < 30;
  const isMoreThan90Minutes = durationMinutes >= 90;
  const titleLineCountRegularVariant = isMoreThan90Minutes ? 2 : 1;

  const content = React.useMemo(() => {
    if (isBetween30and60Minutes || isLessThan30Minutes) {
      return (
        <p
          className={clsx(
            'UnderHourEvent',
            'LinesClamp',
            isLessThan30Minutes && 'Under30MinutesEvent',
          )}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          <span className="EventTitle">{occurrence.title}</span>
          <time className="EventTime">{formatTime(occurrence.start)}</time>
          {isRecurring && (
            <Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true" />
          )}
        </p>
      );
    }
    return (
      <React.Fragment>
        <p
          className={clsx('EventTitle', 'LinesClamp')}
          style={{ '--number-of-lines': titleLineCountRegularVariant } as React.CSSProperties}
        >
          {occurrence.title}
        </p>
        <time
          className={clsx('EventTime', 'LinesClamp')}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          {formatTime(occurrence.start)} - {formatTime(occurrence.end)}
        </time>
        {isRecurring && (
          <Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true" />
        )}
      </React.Fragment>
    );
  }, [
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
    occurrence.title,
    occurrence.start,
    occurrence.end,
    formatTime,
    isRecurring,
  ]);

  const sharedProps = {
    start: occurrence.start,
    end: occurrence.end,
    ref: forwardedRef,
    className: clsx(
      className,
      'TimeGridEvent',
      'EventContainer',
      'EventCard',
      // TODO: Make sure we can use EventCard--placeholder without broken styles
      'EventCard--regular',
      (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard',
      isDraggable && 'Draggable',
      isRecurring && 'Recurrent',
      getColorClassName(color),
    ),
    style: {
      '--first-index': occurrence.position.firstIndex,
      '--last-index': occurrence.position.lastIndex,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <CalendarGrid.TimeEventPlaceholder aria-hidden={true} {...sharedProps}>
        {content}
      </CalendarGrid.TimeEventPlaceholder>
    );
  }

  return (
    <CalendarGrid.TimeEvent
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
    >
      {isResizable && (
        <CalendarGrid.TimeEventResizeHandler side="start" className="TimeGridEventResizeHandler" />
      )}
      {content}
      {isResizable && (
        <CalendarGrid.TimeEventResizeHandler side="end" className="TimeGridEventResizeHandler" />
      )}
    </CalendarGrid.TimeEvent>
  );
});
