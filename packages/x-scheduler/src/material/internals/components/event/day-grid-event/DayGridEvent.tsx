'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/utils/useId';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../../../primitives/day-grid';
import { DayGridEventProps } from './DayGridEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
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
  const { store } = useEventCalendarContext();
  const ampm = useStore(store, selectors.ampm);
  const isRecurring = Boolean(eventProp.rrule);

  const content = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
        return (
          <React.Fragment>
            <p
              className={clsx('DayGridEventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {eventProp.title}
            </p>
            {isRecurring && (
              <Repeat
                size={12}
                strokeWidth={1.5}
                className="EventRecurringIcon"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
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
              {eventProp?.allDay ? (
                <span className="DayGridEventTime">{translations.allDay}</span>
              ) : (
                <time className="DayGridEventTime">
                  <span className="DayGridEventTimeStart">
                    {adapter.format(eventProp.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                  <span className="DayGridEventTimeEnd">
                    {' '}
                    - {adapter.format(eventProp.end, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                </time>
              )}

              <span className="DayGridEventTitle">{eventProp.title}</span>
            </p>
            {isRecurring && (
              <Repeat
                size={12}
                strokeWidth={1.5}
                className="EventRecurringIcon"
                aria-hidden="true"
              />
            )}
          </div>
        );
    }
  }, [
    variant,
    eventProp.title,
    eventProp?.allDay,
    eventProp.start,
    eventProp.end,
    isRecurring,
    eventResource?.name,
    translations,
    ampm,
  ]);

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
      {content}
    </DayGrid.Event>
  );
});
