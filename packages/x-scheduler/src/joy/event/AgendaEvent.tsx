'use client';
import * as React from 'react';
import clsx from 'clsx';
import { TimeGrid } from '../../primitives/time-grid';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { EventProps } from './Event.types';
import './AgendaEvent.css';

const adapter = getAdapter();

export const AgendaEvent = React.forwardRef(function AgendaEvent(
  props: EventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { event, ariaLabelledBy, variant = 'regular', className, style, ...other } = props;

  const renderContent = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
        return <p className={clsx('EventTitle')}>{event.title}</p>;
      case 'regular':
      default:
        return (
          <React.Fragment>
            <p className={clsx('EventTitle')}>{event.title}</p>
            <time
              className={clsx('EventTime')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {adapter.formatByString(event.start, 'h:mm a')} -{' '}
              {adapter.formatByString(event.end, 'h:mm a')}
            </time>
          </React.Fragment>
        );
    }
  }, [variant, event.start, event.title, event.end]);

  return (
    <div ref={forwardedRef} className={clsx('EventContainer', className)} {...other}>
      <time
        className={clsx('EventTime', 'LinesClamp')}
        style={{ '--number-of-lines': 1 } as React.CSSProperties}
      >
        {adapter.formatByString(event.start, 'h:mm a')} -{' '}
        {adapter.formatByString(event.end, 'h:mm a')}
      </time>
      <span>{event.title}</span>
    </div>
  );
});
