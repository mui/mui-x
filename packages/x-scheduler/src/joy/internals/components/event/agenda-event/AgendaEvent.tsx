'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { useId } from '@base-ui-components/react/utils';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { AgendaEventProps } from './AgendaEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import './AgendaEvent.css';

const adapter = getAdapter();

export const AgendaEvent = React.forwardRef(function AgendaEvent(
  props: AgendaEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event: eventProp,
    variant,
    eventResource,
    ariaLabelledBy,
    className,
    style,
    id: idProp,
    onEventClick,
    ...other
  } = props;
  const id = useId(idProp);

  const renderContent = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
        return (
          <p
            className={clsx('EventTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {eventProp.title}
          </p>
        );
      case 'compact':
      default:
        return (
          <div>
            <span className="EventCalendarResourceLegendColor" />
            <div className="EventContent">
              <time
                className={clsx('AgendaEventTime', 'LinesClamp')}
                style={{ '--number-of-lines': 1 } as React.CSSProperties}
              >
                {adapter.formatByString(eventProp.start, 'h:mm a')} -{' '}
                {adapter.formatByString(eventProp.end, 'h:mm a')}
              </time>
              <span className={clsx('AgendaEventTitle', 'LinesClamp')}>{eventProp.title}</span>
            </div>
          </div>
        );
    }
  }, [variant, eventProp.start, eventProp.title, eventProp.end]);

  return (
    <div
      id={id}
      ref={forwardedRef}
      className={clsx('EventContainer', className, getColorClassName({ resource: eventResource }))}
      {...other}
    >
      <Popover.Trigger
        className={clsx('AgendaEventCard', `AgendaEventCard--${variant}`)}
        aria-labelledby={`${ariaLabelledBy} ${id}`}
        onClick={(event) => onEventClick?.(event, eventProp)}
        render={renderContent}
      />
    </div>
  );
});
