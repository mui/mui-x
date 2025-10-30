'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { DayGridEventProps } from './DayGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import { EventDragPreview } from '../../event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import './DayGridEvent.css';
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
import '../../resource-legend/ResourceLegend.css';
import '../index.css';

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  props: DayGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    variant,
    className: classNameProp,
    onEventClick,
    id: idProp,
    style: styleProp,
    ...other
  } = props;

  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const isDraggable = useStore(store, selectors.isEventDraggable, occurrence.id);
  const isResizable = useStore(store, selectors.isEventResizable, occurrence.id, 'day-grid');
  const resource = useStore(store, selectors.resource, occurrence.resource);
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const isRecurring = Boolean(occurrence.rrule);
  const formatTime = useFormatTime();

  const content = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
      case 'invisible':
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
      default:
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
              {occurrence?.allDay ? (
                <span className="DayGridEventTime">{translations.allDay}</span>
              ) : (
                <time className="DayGridEventTime">
                  <span>{formatTime(occurrence.start)}</span>
                  <span> - {formatTime(occurrence.end)}</span>
                </time>
              )}

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
    }
  }, [
    formatTime,
    variant,
    occurrence.title,
    occurrence?.allDay,
    occurrence.start,
    occurrence.end,
    isRecurring,
    resource?.title,
    translations,
  ]);

  const sharedProps = {
    start: occurrence.start,
    end: occurrence.end,
    ref: forwardedRef,
    className: clsx(
      classNameProp,
      'EventContainer',
      'EventCard',
      `EventCard--${variant}`,
      getColorClassName(color),
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
      {isResizable && (
        <CalendarGrid.DayEventResizeHandler side="start" className="DayGridEventResizeHandler" />
      )}
      {content}
      {isResizable && (
        <CalendarGrid.DayEventResizeHandler side="end" className="DayGridEventResizeHandler" />
      )}
    </CalendarGrid.DayEvent>
  );
});
