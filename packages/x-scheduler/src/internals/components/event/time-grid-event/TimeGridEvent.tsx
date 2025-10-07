'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/utils/useId';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import './TimeGridEvent.css';
import '../index.css';

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, ariaLabelledBy, className, id: idProp, variant, ...other } = props;

  const id = useId(idProp);
  const store = useEventCalendarStoreContext();
  const adapter = useAdapter();
  const isRecurring = Boolean(occurrence.rrule);
  const isDraggable = useStore(store, selectors.isEventDraggable);
  const isResizable = useStore(store, selectors.isEventResizable, occurrence.id, 'time-grid');
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const ampm = useStore(store, selectors.ampm);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

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
          <time className="EventTime">{adapter.format(occurrence.start, timeFormat)}</time>
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
          {adapter.format(occurrence.start, timeFormat)} -{' '}
          {adapter.format(occurrence.end, timeFormat)}
        </time>
        {isRecurring && (
          <Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true" />
        )}
      </React.Fragment>
    );
  }, [
    adapter,
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
    occurrence.title,
    occurrence.start,
    occurrence.end,
    timeFormat,
    isRecurring,
  ]);

  const sharedProps = {
    eventId: occurrence.id,
    occurrenceKey: occurrence.key,
    start: occurrence.start,
    end: occurrence.end,
    ref: forwardedRef,
    id,
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
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
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
    <CalendarGrid.TimeEvent isDraggable={isDraggable} {...sharedProps}>
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
