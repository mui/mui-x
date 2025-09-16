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
import { useEventCalendarStoreContext } from '../../../../../primitives/utils/useEventCalendarStoreContext';
import './DayGridEvent.css';
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
import '../../resource-legend/ResourceLegend.css';
import '../index.css';

const adapter = getAdapter();

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  props: DayGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    ariaLabelledBy,
    variant,
    className: classNameProp,
    onEventClick,
    id: idProp,
    style: styleProp,
    ...other
  } = props;

  const id = useId(idProp);
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const isDraggable = useStore(store, selectors.isEventDraggable, occurrence);
  const ampm = useStore(store, selectors.ampm);
  const resource = useStore(store, selectors.resource, occurrence.resource);
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const isRecurring = Boolean(occurrence.rrule);

  const content = React.useMemo(() => {
    switch (variant) {
      case 'allDay':
      case 'invisible':
      case 'dragPlaceholder':
        return (
          <React.Fragment>
            <p
              className={clsx('DayGridEventTitle', 'LinesClamp')}
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

      case 'compact':
      default:
        return (
          <div className="DayGridEventCardWrapper">
            <span
              className="ResourceLegendColor"
              role="img"
              aria-label={
                resource?.name
                  ? translations.resourceAriaLabel(resource.name)
                  : translations.noResourceAriaLabel
              }
            />
            <p
              className={clsx('DayGridEventCardContent', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {occurrence?.allDay ? (
                <span className="DayGridEventTime">{translations.allDay}</span>
              ) : (
                <time className="DayGridEventTime">
                  <span>
                    {adapter.format(occurrence.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                  <span>
                    {' '}
                    - {adapter.format(occurrence.end, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                </time>
              )}

              <span className="DayGridEventTitle">{occurrence.title}</span>
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
    occurrence.title,
    occurrence?.allDay,
    occurrence.start,
    occurrence.end,
    isRecurring,
    resource?.name,
    translations,
    ampm,
  ]);

  const sharedProps = {
    ref: forwardedRef,
    id,
    className: clsx(
      classNameProp,
      'EventContainer',
      'EventCard',
      `EventCard--${variant}`,
      getColorClassName(color),
    ),
    style: {
      '--grid-row': occurrence.position.index,
      '--grid-column-span': occurrence.position.daySpan,
      ...styleProp,
    } as React.CSSProperties,
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
    ...other,
  };

  if (variant === 'dragPlaceholder') {
    return (
      <DayGrid.EventPlaceholder aria-hidden={true} {...sharedProps}>
        {content}
      </DayGrid.EventPlaceholder>
    );
  }

  return (
    <DayGrid.Event
      eventId={occurrence.id}
      start={occurrence.start}
      end={occurrence.end}
      isDraggable={isDraggable}
      aria-hidden={variant === 'invisible'}
      {...sharedProps}
    >
      {content}
    </DayGrid.Event>
  );
});
