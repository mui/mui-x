'use client';
import * as React from 'react';
import clsx from 'clsx';
import { TimeGrid } from '../../../primitives/time-grid';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { EventProps } from '../Event.types';
import './AgendaEvent.css';
import { getColorClassName } from '../../internals/utils/color-utils';

const adapter = getAdapter();

export const AgendaEvent = React.forwardRef(function AgendaEvent(
  props: EventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event,
    eventResource,
    ariaLabelledBy,
    variant = 'regular',
    className,
    style,
    ...other
  } = props;

  console.log('AgendaEvent', event, eventResource, getColorClassName({ resource: eventResource }));
  return (
    <div
      ref={forwardedRef}
      className={clsx('EventContainer', className, getColorClassName({ resource: eventResource }))}
      {...other}
    >
      <span className="EventCalendarResourceLegendColor" />
      <div className="EventContent">
        <time
          className={clsx('AgendaEventTime', 'LinesClamp')}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          {adapter.formatByString(event.start, 'h:mm a')} -{' '}
          {adapter.formatByString(event.end, 'h:mm a')}
        </time>
        <span className={clsx('AgendaEventTitle', 'LinesClamp')}>{event.title}</span>
      </div>
    </div>
  );
});
