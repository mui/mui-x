'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { useId } from '@base-ui-components/react/utils';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../../../primitives/day-grid';
import { DayGridEventProps } from './DayGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import './DayGridEvent.css';
import '../index.css';

const adapter = getAdapter();

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  props: DayGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    event: eventProp,
    eventResource,
    ariaLabelledBy,
    variant,
    className,
    onEventClick,
    id: idProp,
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
          <p
            className={clsx('EventCardContent', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            <time className="EventTime">
              <span className="EventTimeStart">
                {adapter.formatByString(eventProp.start, 'h:mm a')}
              </span>
              <span className="EventTimeEnd">
                {' '}
                - {adapter.formatByString(eventProp.end, 'h:mm a')}
              </span>
            </time>
            <span className="EventTitle">{eventProp.title}</span>
          </p>
        );
    }
  }, [variant, eventProp.title, eventProp.start, eventProp.end]);

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={clsx('EventContainer', className, getColorClassName({ resource: eventResource }))}
      {...other}
    >
      <Popover.Trigger
        className={clsx('EventCard', `EventCard--${variant}`)}
        aria-labelledby={`${ariaLabelledBy} ${id}`}
        onClick={(event) => onEventClick?.(event, eventProp)}
        render={
          <DayGrid.Event start={eventProp.start} end={eventProp.end}>
            {renderContent}
          </DayGrid.Event>
        }
      />
    </div>
  );
});
