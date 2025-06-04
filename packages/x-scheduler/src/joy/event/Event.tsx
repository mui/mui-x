'use client';
import * as React from 'react';
import clsx from 'clsx';
import { TimeGrid } from '../../primitives/time-grid';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { EventProps } from './Event.types';
import './Event.css';

export const Event = React.forwardRef(function Event(
  props: EventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { event, isPositioned, ariaLabelledBy, className, ...other } = props;
  const adapter = useAdapter();

  return (
    <div ref={forwardedRef} className={clsx('EventContainer', className)} {...other}>
      <TimeGrid.Event
        className={clsx('EventCard', { EventPositioned: isPositioned })}
        start={event.start}
        end={event.end}
        aria-labelledby={ariaLabelledBy}
      >
        <time>
          {adapter.formatByString(event.start, 'h:mma')} -{' '}
          {adapter.formatByString(event.end, 'h:mma')}
        </time>
        <br />
        <span>{event.title}</span>
      </TimeGrid.Event>
    </div>
  );
});
