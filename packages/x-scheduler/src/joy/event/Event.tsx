'use client';
import * as React from 'react';
import clsx from 'clsx';
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
  const { event, eventResource, ariaLabelledBy, variant, className, id: idProp, ...other } = props;

  const id = useId(idProp);

  const durationMs =
    adapter.toJsDate(event.end).getTime() - adapter.toJsDate(event.start).getTime();
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
              {adapter.formatByString(event.start, 'h:mm a')}
            </time>
            <p
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {event.title}
            </p>
          </React.Fragment>
        );
      case 'allDay':
        return (
          <p
            className={clsx('EventTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {event.title}
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
              <span className="EventTitle">{event.title}</span>
              <time className="EventTime">{adapter.formatByString(event.start, 'h:mm a')}</time>
            </p>
          );
        }
        return (
          <React.Fragment>
            <p
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': titleLineCountRegularVariant } as React.CSSProperties}
            >
              {event.title}
            </p>
            <time
              className={clsx('EventTime', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {adapter.formatByString(event.start, 'h:mm a')} -{' '}
              {adapter.formatByString(event.end, 'h:mm a')}
            </time>
          </React.Fragment>
        );
    }
  }, [
    variant,
    event.start,
    event.title,
    event.end,
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
  ]);

  return (
    <div
      ref={forwardedRef}
      className={clsx('EventContainer', className, getColorClassName({ resource: eventResource }))}
      id={id}
      {...other}
    >
      <TimeGrid.Event
        className={clsx(
          'EventCard',
          `EventCard--${variant}`,
          (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard',
        )}
        start={event.start}
        end={event.end}
        aria-labelledby={`${ariaLabelledBy} ${id}`}
      >
        {renderContent}
      </TimeGrid.Event>
    </div>
  );
});
