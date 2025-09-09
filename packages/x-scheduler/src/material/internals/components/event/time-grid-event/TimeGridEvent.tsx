'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/utils/useId';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../../primitives/time-grid';
import { getColorClassName } from '../../../utils/color-utils';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
import './TimeGridEvent.css';
import '../index.css';

const adapter = getAdapter();

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { event: eventProp, ariaLabelledBy, variant, className, id: idProp, ...other } = props;

  const id = useId(idProp);
  const { store } = useEventCalendarContext();

  const isRecurring = Boolean(eventProp.rrule);
  const isDraggable = useStore(store, selectors.isEventDraggable, eventProp);
  const isResizable = useStore(store, selectors.isEventResizable, eventProp);
  const color = useStore(store, selectors.eventColor, eventProp.id);
  const ampm = useStore(store, selectors.ampm);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const durationMs =
    adapter.toJsDate(eventProp.end).getTime() - adapter.toJsDate(eventProp.start).getTime();
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
          <span className="EventTitle">{eventProp.title}</span>
          <time className="EventTime">{adapter.format(eventProp.start, timeFormat)}</time>
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
          {eventProp.title}
        </p>
        <time
          className={clsx('EventTime', 'LinesClamp')}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          {adapter.format(eventProp.start, timeFormat)} -{' '}
          {adapter.format(eventProp.end, timeFormat)}
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
    eventProp.title,
    eventProp.start,
    eventProp.end,
    timeFormat,
    isRecurring,
  ]);

  return (
    <TimeGrid.Event
      ref={forwardedRef}
      id={id}
      isDraggable={isDraggable}
      className={clsx(
        className,
        'EventContainer',
        'EventCard',
        `EventCard--${variant}`,
        (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard',
        isDraggable && 'Draggable',
        isRecurring && 'Recurrent',
        getColorClassName(color),
      )}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      eventId={eventProp.id}
      start={eventProp.start}
      end={eventProp.end}
      {...other}
    >
      {isResizable && <TimeGrid.EventResizeHandler side="start" className="EventResizeHandler" />}
      {content}
      {isResizable && <TimeGrid.EventResizeHandler side="end" className="EventResizeHandler" />}
    </TimeGrid.Event>
  );
});
