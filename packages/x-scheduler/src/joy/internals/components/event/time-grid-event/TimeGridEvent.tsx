'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/react/utils';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../../primitives/time-grid';
import { getColorClassName } from '../../../utils/color-utils';
import './TimeGridEvent.css';
import '../index.css';

const adapter = getAdapter();

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event: eventProp,
    eventResource,
    ariaLabelledBy,
    variant,
    className,
    id: idProp,
    ...other
  } = props;

  const id = useId(idProp);

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
          <time className="EventTime">{adapter.formatByString(eventProp.start, 'h:mm a')}</time>
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
          {adapter.formatByString(eventProp.start, 'h:mm a')} -{' '}
          {adapter.formatByString(eventProp.end, 'h:mm a')}
        </time>
      </React.Fragment>
    );
  }, [
    eventProp.start,
    eventProp.title,
    eventProp.end,
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
  ]);

  return (
    <TimeGrid.Event
      ref={forwardedRef}
      id={id}
      className={clsx(
        className,
        'EventContainer',
        'EventCard',
        `EventCard--${variant}`,
        (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard',
        getColorClassName({ resource: eventResource }),
      )}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      eventId={eventProp.id}
      start={eventProp.start}
      end={eventProp.end}
      {...other}
    >
      {content}
    </TimeGrid.Event>
  );
});
