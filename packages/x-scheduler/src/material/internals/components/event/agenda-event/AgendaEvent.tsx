'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useId } from '@base-ui-components/utils/useId';
import { useStore } from '@base-ui-components/utils/store';
import { Repeat } from 'lucide-react';
import { getAdapter } from '../../../../../primitives/utils/adapter/getAdapter';
import { AgendaEventProps } from './AgendaEvent.types';
import { getColorClassName } from '../../../utils/color-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { useEventCalendarStoreContext } from '../../../../../primitives/utils/useEventCalendarStoreContext';
import './AgendaEvent.css';
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
import '../../resource-legend/ResourceLegend.css';
import '../index.css';

const adapter = getAdapter();

export const AgendaEvent = React.forwardRef(function AgendaEvent(
  props: AgendaEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    ariaLabelledBy,
    className,
    onEventClick,
    id: idProp,
    style,
    ...other
  } = props;

  const id = useId(idProp);
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const ampm = useStore(store, selectors.ampm);
  const resource = useStore(store, selectors.resource, occurrence.resource);
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const isRecurring = Boolean(occurrence.rrule);

  return (
    // TODO: Use button
    <div
      ref={forwardedRef}
      id={id}
      className={clsx(
        className,
        'EventContainer',
        'EventCard',
        `EventCard--compact`, // Add a "variant" prop if we add support for other variants
        getColorClassName(color),
      )}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      {...other}
    >
      <div className="AgendaEventCardWrapper">
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
          className={clsx('AgendaEventCardContent', 'LinesClamp')}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          {occurrence?.allDay ? (
            <span className="AgendaEventTime">{translations.allDay}</span>
          ) : (
            <time className="AgendaEventTime">
              <span>
                {adapter.format(occurrence.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
              </span>
              <span>
                {' '}
                - {adapter.format(occurrence.end, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
              </span>
            </time>
          )}

          <span className="AgendaEventTitle">{occurrence.title}</span>
        </p>
        {isRecurring && (
          <Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true" />
        )}
      </div>
    </div>
  );
});
