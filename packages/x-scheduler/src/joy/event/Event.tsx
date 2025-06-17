'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { useId } from '@base-ui-components/react/utils';
import { TimeGrid } from '../../primitives/time-grid';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { EventProps } from './Event.types';
import { getColorClassName } from '../internals/utils/color-utils';
import './Event.css';

const adapter = getAdapter();

export const Event = React.forwardRef(function Event(
  props: EventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event: calendarEvent,
    eventResource,
    ariaLabelledBy,
    variant,
    className,
    onEventClick,
    id: idProp,
    ...other
  } = props;

  const id = useId(idProp);

  const durationMs =
    adapter.toJsDate(calendarEvent.end).getTime() - adapter.toJsDate(calendarEvent.start).getTime();
  const durationMinutes = durationMs / 60000;
  const isBetween30and60Minutes = durationMinutes >= 30 && durationMinutes < 60;
  const isLessThan30Minutes = durationMinutes < 30;
  const isMoreThan90Minutes = durationMinutes >= 90;
  const titleLineCountRegularVariant = isMoreThan90Minutes ? 2 : 1;

  const renderContent = React.useMemo(() => {
    switch (variant) {
      case 'compact':
        return (
          <React.Fragment>
            <time className={clsx('EventTime')}>
              {adapter.formatByString(calendarEvent.start, 'h:mm a')}
            </time>
            <p
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {calendarEvent.title}
            </p>
          </React.Fragment>
        );
      case 'allDay':
        return (
          <p
            className={clsx('EventTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {calendarEvent.title}
          </p>
        );
      case 'regular':
      default:
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
              <span className="EventTitle">{calendarEvent.title}</span>
              <time className="EventTime">
                {adapter.formatByString(calendarEvent.start, 'h:mm a')}
              </time>
            </p>
          );
        }
        return (
          <React.Fragment>
            <p
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': titleLineCountRegularVariant } as React.CSSProperties}
            >
              {calendarEvent.title}
            </p>
            <time
              className={clsx('EventTime', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {adapter.formatByString(calendarEvent.start, 'h:mm a')} -{' '}
              {adapter.formatByString(calendarEvent.end, 'h:mm a')}
            </time>
          </React.Fragment>
        );
    }
  }, [
    variant,
    calendarEvent.start,
    calendarEvent.title,
    calendarEvent.end,
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
  ]);

  const handleEventClick =
    (triggerOnClick?: (e: React.MouseEvent) => void) => (event: React.MouseEvent) => {
      // triggerOnClick?.(event);
      onEventClick?.(calendarEvent, event);
    };

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={clsx('EventContainer', className, getColorClassName({ resource: eventResource }))}
      {...other}
    >
      <Popover.Trigger
        render={({ ...triggerProps }) => (
          <TimeGrid.Event
            {...triggerProps}
            className={clsx(
              'EventCard',
              `EventCard--${variant}`,
              (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard',
            )}
            start={calendarEvent.start}
            end={calendarEvent.end}
            aria-labelledby={`${ariaLabelledBy} ${id}`}
            onClick={handleEventClick(triggerProps.onClick)}
          >
            {renderContent}
          </TimeGrid.Event>
        )}
      />
    </div>
  );
});
