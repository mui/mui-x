'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/utils/useId';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { EventItemProps } from './EventItem.types';
import { getColorClassName } from '../../../utils/color-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import './EventItem.css';
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
import '../../resource-legend/ResourceLegend.css';
import '../index.css';

/**
 * Component used to display an event occurrence, without any positioning capabilities
 * Used in <AgendaView /> and in the event popover of <MonthView /> to display the list of events for a specific day.
 */
export const EventItem = React.forwardRef(function EventItem(
  props: EventItemProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    ariaLabelledBy,
    className,
    onEventClick,
    id: idProp,
    style,
    variant = 'regular',
    ...other
  } = props;

  // Context hooks
  const translations = useTranslations();
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();

  // State hooks
  const id = useId(idProp);

  // Selector hooks
  const ampm = useStore(store, selectors.ampm);
  const resource = useStore(store, selectors.resource, occurrence.resource);
  const color = useStore(store, selectors.eventColor, occurrence.id);

  const isRecurring = Boolean(occurrence.rrule);

  const content = React.useMemo(() => {
    switch (variant) {
      case 'compact':
        return (
          <React.Fragment>
            <span
              className="ResourceLegendColor"
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <p
              className={clsx('EventItemCardContent', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              <time className="EventItemTime EventItemTime--compact">
                <span>
                  {adapter.format(occurrence.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                </span>
              </time>

              <span className="EventItemTitle">{occurrence.title}</span>
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

      case 'allDay':
        return (
          <React.Fragment>
            <p
              className={clsx('EventItemTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {occurrence.title}
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
      case 'regular':
      default:
        return (
          <div className="EventItemCardWrapper">
            <span
              className="ResourceLegendColor"
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <p
              className={clsx('EventItemCardContent', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {occurrence?.allDay ? (
                <span className="EventItemTime">{translations.allDay}</span>
              ) : (
                <time className="EventItemTime">
                  <span>
                    {adapter.format(occurrence.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                  <span>
                    {' '}
                    - {adapter.format(occurrence.end, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                </time>
              )}

              <span className="EventItemTitle">{occurrence.title}</span>
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
    adapter,
    variant,
    occurrence.title,
    occurrence?.allDay,
    occurrence.start,
    occurrence.end,
    isRecurring,
    resource?.title,
    translations,
    ampm,
  ]);

  return (
    // TODO: Use button
    <div
      ref={forwardedRef}
      id={id}
      className={clsx(
        className,
        'EventContainer',
        'EventCard',
        'EventItemCard',
        `EventItemCard--${variant}`,
        getColorClassName(color),
      )}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      {...other}
    >
      <div className={clsx('EventItemCardWrapper', `EventItemCardWrapper--${variant}`)}>
        {content}
      </div>
    </div>
  );
});
