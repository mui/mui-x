'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/react/utils';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../../../primitives/day-grid';
import { DayGridEventProps } from './DayGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
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
  const translations = useTranslations();

  const renderContent = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
        return (
          <p
            className={clsx('DayGridEventTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {eventProp.title}
          </p>
        );
      case 'compact':
      default:
        return (
          <div className="DayGridEventCardWrapper">
            <span
              className="ResourceLegendColor"
              role="img"
              aria-label={
                eventResource?.name
                  ? translations.resourceAriaLabel(eventResource.name)
                  : translations.noResourceAriaLabel
              }
            />
            <p
              className={clsx('DayGridEventCardContent', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              <time className="DayGridEventTime">
                <span className="DayGridEventTimeStart">
                  {adapter.formatByString(eventProp.start, 'h:mm a')}
                </span>
                <span className="DayGridEventTimeEnd">
                  {' '}
                  - {adapter.formatByString(eventProp.end, 'h:mm a')}
                </span>
              </time>
              <span className="DayGridEventTitle">{eventProp.title}</span>
            </p>
          </div>
        );
    }
  }, [variant, eventProp.title, eventProp.start, eventProp.end, eventResource?.name, translations]);

  return (
    <DayGrid.Event
      ref={forwardedRef}
      id={id}
      className={clsx(
        className,
        'EventContainer',
        'EventCard',
        `EventCard--${variant}`,
        getColorClassName({ resource: eventResource }),
      )}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      start={eventProp.start}
      end={eventProp.end}
      {...other}
    >
      {renderContent}
    </DayGrid.Event>
  );
});
