'use client';
import * as React from 'react';
import clsx from 'clsx';
import { createSelector, useStore } from '@base-ui/utils/store';
import { Repeat } from 'lucide-react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { SchedulerEventOccurrence, SchedulerEventSide } from '@mui/x-scheduler-headless/models';
import { EventCalendarState } from '@mui/x-scheduler-headless/use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { DayGridEventProps } from './DayGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { isOccurrenceAllDayOrMultipleDay } from '../../../utils/event-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import { EventDragPreview } from '../../event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import './DayGridEvent.css';
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
import '../../resource-legend/ResourceLegend.css';
import '../index.css';

const isResizableSelector = createSelector(
  (state: EventCalendarState, side: SchedulerEventSide, occurrence: SchedulerEventOccurrence) => {
    if (!schedulerEventSelectors.isResizable(state, occurrence.id, side)) {
      return false;
    }

    const view = eventCalendarViewSelectors.view(state);

    // There is only one day cell in the day view
    if (view === 'day') {
      return false;
    }

    // In month view, only multi-day and all-day events can be resized
    if (view === 'month') {
      return isOccurrenceAllDayOrMultipleDay(occurrence, state.adapter);
    }

    return true;
  },
);

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  props: DayGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    variant,
    className: classNameProp,
    id: idProp,
    style: styleProp,
    ...other
  } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(store, isResizableSelector, 'start', occurrence);
  const isEndResizable = useStore(store, isResizableSelector, 'end', occurrence);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);

  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    occurrence.resource,
  );
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);

  // Feature hooks
  const formatTime = useFormatTime();

  const content = React.useMemo(() => {
    switch (variant) {
      case 'invisible': {
        return null;
      }
      case 'filled':
      case 'placeholder':
        return (
          <React.Fragment>
            <p
              className={clsx('DayGridEventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {occurrence.title}
            </p>
            {isRecurring && (
              <Repeat
                size={12}
                strokeWidth={1.5}
                className="EventRecurringIcon"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );

      case 'compact':
        return (
          <div className="DayGridEventCardWrapper">
            <span
              className="EventColorIndicator"
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <p
              className={clsx('DayGridEventCardContent', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              <time className="DayGridEventTime">
                <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
                <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
              </time>
              <span className="DayGridEventTitle">{occurrence.title}</span>
            </p>
            {isRecurring && (
              <Repeat
                size={12}
                strokeWidth={1.5}
                className="EventRecurringIcon"
                aria-hidden="true"
              />
            )}
          </div>
        );
      default:
        throw new Error('Unsupported variant provided to EventItem component.');
    }
  }, [
    variant,
    occurrence.title,
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
    isRecurring,
    resource?.title,
    translations,
    formatTime,
  ]);

  const sharedProps = {
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    className: clsx(
      classNameProp,
      'EventContainer',
      'EventCard',
      `EventCard--${variant}`,
      getColorClassName(color),
      occurrence.className,
    ),
    style: {
      '--grid-row': occurrence.position.index,
      '--grid-column-span': occurrence.position.daySpan,
      ...styleProp,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <CalendarGrid.DayEventPlaceholder aria-hidden={true} {...sharedProps}>
        {content}
      </CalendarGrid.DayEventPlaceholder>
    );
  }

  return (
    <CalendarGrid.DayEvent
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      isDraggable={isDraggable}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      aria-hidden={variant === 'invisible'}
      {...sharedProps}
    >
      {isStartResizable && (
        <CalendarGrid.DayEventResizeHandler side="start" className="DayGridEventResizeHandler" />
      )}
      {content}
      {isEndResizable && (
        <CalendarGrid.DayEventResizeHandler side="end" className="DayGridEventResizeHandler" />
      )}
    </CalendarGrid.DayEvent>
  );
});
