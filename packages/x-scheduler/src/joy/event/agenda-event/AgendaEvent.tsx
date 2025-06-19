'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/react/utils';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import './AgendaEvent.css';
import { getColorClassName } from '../../internals/utils/color-utils';
import { AgendaEventProps } from './AgendaEventProps';

const adapter = getAdapter();

export const AgendaEvent = React.forwardRef(function AgendaEvent(
  props: AgendaEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event,
    eventResource,
    ariaLabelledBy,
    variant = 'regular',
    className,
    style,
    id: idProp,
    ...other
  } = props;
  const id = useId(idProp);

  return (
    <div
      id={id}
      ref={forwardedRef}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
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
